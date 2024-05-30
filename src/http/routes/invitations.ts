import { FastifyInstance } from 'fastify'

import { accept, create, reject } from '__http/controllers/invitations'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function invitationsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [validateAccessToken] }, create)
  app.post('/:senderId', { preHandler: [validateAccessToken] }, accept)
  app.delete('/:senderId', { preHandler: [validateAccessToken] }, reject)
}
