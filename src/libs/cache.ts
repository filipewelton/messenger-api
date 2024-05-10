import { createClient } from 'redis'

import { ExternalServiceError } from '__utils/errors/external-service'

import { env } from './environment'

export async function startCacheConnection() {
  const client = createClient({
    database: 0,
    socket: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
  })

  client.on('error', (error) => {
    console.log(error)
    throw new ExternalServiceError(error)
  })

  return await client.connect()
}
