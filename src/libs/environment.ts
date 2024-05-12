import { config } from 'dotenv'
import { z } from 'zod'

const { NODE_ENV } = process.env

if (NODE_ENV === 'test') config({ path: '.env.test' })
else if (NODE_ENV !== 'production') config({ path: '.env' })

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string(),
  DATABASE_CLIENT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PORT: z.coerce.number(),
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
  STORAGE_SERVICE_HOST: z.string(),
  STORAGE_SERVICE_PORT: z.coerce.number(),
})

export const env = schema.parse(process.env)
