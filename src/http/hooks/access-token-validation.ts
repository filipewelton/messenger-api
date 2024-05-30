import { FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { env } from '__libs/environment'
import { UnauthorizedError } from '__utils/errors/unauthorized'

export async function validateAccessToken(request: FastifyRequest) {
  const token = request.headers.authorization?.replace('Bearer ', '') ?? ''

  try {
    const payload = verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    })

    if (typeof payload === 'string') return

    request.sessionUserId = payload.userId
  } catch (error) {
    throw new UnauthorizedError(error)
  }
}
