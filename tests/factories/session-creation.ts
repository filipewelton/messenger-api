import { faker } from '@faker-js/faker'
import { sign } from 'jsonwebtoken'

import { env } from '__libs/environment'

interface Params {
  userId?: string
}

export function createSession(params?: Params) {
  const sessionToken = sign(
    {
      userId: params?.userId ?? faker.string.uuid(),
    },
    env.JWT_SECRET,
    { algorithm: 'HS256' },
  )
  const bearerToken = `Bearer ${sessionToken}`
  return { bearerToken }
}
