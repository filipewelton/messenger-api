import { Connection, connect } from 'amqplib'

import { env } from '__libs/environment'
import { ExternalServiceError } from '__utils/errors/external-service'

export abstract class AMQP {
  protected connection: Connection | null = null
  abstract execute(params: unknown): Promise<unknown>

  protected async startConnection() {
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
}
