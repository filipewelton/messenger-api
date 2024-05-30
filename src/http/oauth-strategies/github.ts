import oauth2, { FastifyOAuth2Options } from '@fastify/oauth2'

import { env } from '__libs/environment'

const baseURL = `http://${env.HOST}:${env.PORT}`

export const githubStrategy: FastifyOAuth2Options = {
  name: 'githubStrategy',
  credentials: {
    client: {
      id: env.GITHUB_CLIENT_ID,
      secret: env.GITHUB_CLIENT_SECRET,
    },
    auth: oauth2.GITHUB_CONFIGURATION,
  },
  startRedirectPath: '/users/sessions/github',
  callbackUri: `${baseURL}/users/sessions/callback?provider=github`,
  scope: ['profile', 'email'],
}
