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
})

export const env = schema.parse(process.env)
