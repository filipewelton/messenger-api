import { faker } from '@faker-js/faker'
import { sign } from 'jsonwebtoken'

import { env } from '__libs/environment'

interface Params {
  userId?: string
}

export function createSession(params?: Params) {
  const accessToken = sign(
    {
      userId: params?.userId ?? faker.string.uuid(),
    },
    env.JWT_SECRET,
    { algorithm: 'HS256' },
  )
  const cookie = [`access_token=${accessToken}`]
  return { cookie }
}
