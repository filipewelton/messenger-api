import { FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { env } from '__libs/environment'
import { UnauthorizedError } from '__utils/errors/unauthorized'

export async function validateAccessToken(request: FastifyRequest) {
  const token =
    request.headers.cookie?.split(';')[0]?.replace(/^(access_token)[=]/, '') ??
    ''

  try {
    verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    })
  } catch (error) {
    throw new UnauthorizedError(error)
  }
}
