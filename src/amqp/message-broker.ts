import { Connection, connect } from 'amqplib'

import { env } from '__libs/environment'
import { ExternalServiceError } from '__utils/errors/external-service'

interface UserMessageSending {
  message: Buffer
  recipientId: string
}

interface GroupMessageSending {
  message: Buffer
  groupId: string
}

type Resolver = (message: string) => void

interface UserMessageReceive {
  recipientId: string
  resolver: Resolver
}

interface GroupMessageReceive {
  groupId: string
  resolver: Resolver
}

export class MessageBroker {
  private connection: Connection | null = null

  public async send(params: UserMessageSending | GroupMessageSending) {
    if (!this.connection) {
      throw new ExternalServiceError('Rabbitmq is not connected.')
    }

    if ('recipientId' in params) await this.handleUserMessageSending(params)
    else if ('groupId' in params) await this.handleGroupMessageSending(params)
  }

  private async handleUserMessageSending(params: UserMessageSending) {
    const { message, recipientId } = params
    const channel = await this.connection!.createChannel()
    const exchange = 'exclusive'

    await channel.assertExchange(exchange, 'direct', { durable: false })

    const reply = channel.publish(exchange, recipientId, message)

    if (!reply) throw new ExternalServiceError('The message was not send.')
  }

  private async handleGroupMessageSending(params: GroupMessageSending) {
    const { groupId, message } = params
    const channel = await this.connection!.createChannel()

    await channel.assertExchange(groupId, 'fanout', { durable: false })

    const reply = channel.publish(groupId, '', message)

    if (!reply) throw new ExternalServiceError('The message was not send.')
  }

  public async receive(params: UserMessageReceive | GroupMessageReceive) {
    if (!this.connection) {
      throw new ExternalServiceError('Rabbitmq is not connected.')
    }

    if ('recipientId' in params) await this.handleUserMessageReceipt(params)
    else if ('groupId' in params) await this.handleGroupMessageReceipt(params)
  }

  private async handleUserMessageReceipt(params: UserMessageReceive) {
    const { recipientId, resolver } = params
    const channel = await this.connection!.createChannel()
    const exchange = 'exclusive'

    await channel.assertExchange(exchange, 'direct', { durable: false })

    const { queue } = await channel.assertQueue('', { exclusive: true })

    await channel.bindQueue(queue, exchange, recipientId)

    await channel.consume(
      queue,
      (message) => {
        if (!message) return

        const content = Buffer.from(message.content).toString()

        channel.ack(message)
        resolver(content)
      },
      { noAck: false },
    )
  }

  private async handleGroupMessageReceipt(params: GroupMessageReceive) {
    const { groupId, resolver } = params
    const channel = await this.connection!.createChannel()

    await channel.assertExchange(groupId, 'fanout', { durable: false })

    const { queue } = await channel.assertQueue('', { exclusive: true })

    await channel.bindQueue(queue, groupId, '')

    await channel.consume(
      queue,
      (message) => {
        if (!message) return

        const content = Buffer.from(message.content).toString()

        channel.ack(message)
        resolver(content)
      },
      { noAck: false },
    )
  }

  public async open() {
    try {
      const connection = await connect({
        hostname: env.RABBITMQ_HOST,
        port: env.RABBITMQ_PORT,
        password: env.RABBITMQ_PASSWORD,
        username: env.RABBITMQ_USERNAME,
      })

      this.connection = connection
    } catch (error) {
      throw new ExternalServiceError(error)
    }
  }

  public async close() {
    await this.connection?.close()
  }
}
