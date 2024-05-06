import { FastifyRequest } from 'fastify'

import { app } from '__http/app'

import { ResourceNotFoundError } from './errors/resource-not-found'

export async function getAccessTokenFromAuthorizationCodeFlow(
  request: FastifyRequest,
) {
  try {
    const {
      token: { access_token: accessToken },
    } =
      await app.githubStrategy.getAccessTokenFromAuthorizationCodeFlow(request)

    return accessToken
  } catch {
    throw new ResourceNotFoundError('OAuth account was not found.')
  }
}
