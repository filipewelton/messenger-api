import { sign } from 'jsonwebtoken'

import { env } from '__libs/environment'

export function createSession() {
  const accessToken = sign({}, env.JWT_SECRET, { algorithm: 'HS256' })
  const cookie = [`access_token=${accessToken}`]
  return { cookie }
}
