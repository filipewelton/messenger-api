import { Connection, connect } from 'amqplib'

import { env } from '__libs/environment'
import { ExternalServiceError } from '__utils/errors/external-service'

interface MessageSendingParams {
  message: Buffer
  recipientId: string
}

interface MessageReceivingParams {
  recipientId: string
  resolve: (message: string) => void
}

export class AMQP {
  private connection: Connection | null = null

  public async startConnection() {
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

  async sendExclusiveMessage(params: MessageSendingParams) {
    if (!this.connection) {
      throw new ExternalServiceError('Rabbitmq is not connected.')
    }

    const { message, recipientId } = params
    const channel = await this.connection.createChannel()
    const exchange = 'exclusive'

    await channel.assertExchange(exchange, 'direct', { durable: false })

    const reply = channel.publish(exchange, recipientId, message)

    if (!reply) throw new ExternalServiceError('The message was not send.')
  }

  async receiveExclusiveMessage(params: MessageReceivingParams) {
    if (!this.connection) {
      throw new ExternalServiceError('Rabbitmq is not connected.')
    }

    const { recipientId, resolve } = params
    const channel = await this.connection.createChannel()
    const exchange = 'exclusive'

    await channel.assertExchange(exchange, 'direct', { durable: false })

    const { queue } = await channel.assertQueue('', { exclusive: true })

    await channel.bindQueue(queue, exchange, recipientId)

    await channel.consume(
      queue,
      (message) => {
        if (!message) return

        const invitation = Buffer.from(message.content).toString()

        channel.ack(message)
        resolve(invitation)
      },
      { noAck: false },
    )
  }
}
