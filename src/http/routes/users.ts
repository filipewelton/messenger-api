import { FastifyInstance } from 'fastify'

import { createSession } from '__http/controllers/users'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/sessions/callback', createSession)
}
