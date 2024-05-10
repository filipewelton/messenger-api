import { AMQP } from '__amqp/amqp'

interface Params {
  recipientId: string
  resolve: (invitation: string) => void
}

export class ReceiveInvitation extends AMQP {
  async execute(params: Params) {
    const { recipientId, resolve } = params

    if (!this.connection) await this.startConnection()

    const channel = await this.connection!.createChannel()
    const exchange = 'invitations'

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
