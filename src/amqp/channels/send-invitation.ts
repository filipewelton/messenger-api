import { AMQP } from '__amqp/amqp'
import { ExternalServiceError } from '__utils/errors/external-service'

interface Params {
  recipientId: string
  message: string
}

export class SendInvitation extends AMQP {
  async execute(params: Params) {
    if (!this.connection) await this.startConnection()

    const { message, recipientId } = params
    const channel = await this.connection!.createChannel()
    const exchange = 'invitations'

    await channel.assertExchange(exchange, 'direct', { durable: false })

    const reply = channel.publish(exchange, recipientId, Buffer.from(message))

    if (!reply) throw new ExternalServiceError('The message was not send.')
  }
}
