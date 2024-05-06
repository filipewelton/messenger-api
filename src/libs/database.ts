import { Knex, knex } from 'knex'

import { env } from '__libs/environment'

const connection =
  env.NODE_ENV === 'production'
    ? { uri: env.DATABASE_URL }
    : { filename: env.DATABASE_URL }

export const config: Knex.Config = {
  connection,
  client: env.DATABASE_CLIENT,
  useNullAsDefault: true,
  migrations: {
    directory: './database',
  },
}

export const database = knex(config)
