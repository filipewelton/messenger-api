import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  createClient,
} from 'redis'

import { ExternalServiceError } from '__utils/errors/external-service'

import { env } from './environment'

export type CacheClient = RedisClientType<
  RedisModules &
    RedisScripts &
    RedisFunctions & {
      json: {
        set: typeof import('node_modules/@redis/json/dist/commands/SET')
        get: typeof import('node_modules/@redis/json/dist/commands/GET')
        del: typeof import('node_modules/@redis/json/dist/commands/DEL')
      }
    }
>

export async function startCacheConnection(): Promise<CacheClient> {
  const client: CacheClient = createClient({
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
