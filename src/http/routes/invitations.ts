import { FastifyInstance } from 'fastify'

import { accept, create, reject } from '__http/controllers/invitations'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function invitationsRoutes(app: FastifyInstance) {
  app.post('/:id', { preHandler: [validateAccessToken] }, create)
  app.post('/acceptance', { preHandler: [validateAccessToken] }, accept)
  app.delete('/acceptance', { preHandler: [validateAccessToken] }, reject)
}
