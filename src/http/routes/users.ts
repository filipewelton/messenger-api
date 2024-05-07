import { FastifyInstance } from 'fastify'

import { createSession, update } from '__http/controllers/users'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/sessions/callback', createSession)
  app.patch('/:id', { preHandler: [validateAccessToken] }, update)
}
