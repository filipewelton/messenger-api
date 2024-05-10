import { OAuth2Namespace } from '@fastify/oauth2'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    githubStrategy: OAuth2Namespace
  }

  export interface FastifyRequest {
    sessionUserId: string | null
  }
}
