import { FastifyInstance } from 'fastify'

import { createSession, del, update } from '__http/controllers/users'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/sessions/callback', createSession)
  app.patch('/:id', { preHandler: [validateAccessToken] }, update)
  app.delete('/:id', { preHandler: [validateAccessToken] }, del)
}
