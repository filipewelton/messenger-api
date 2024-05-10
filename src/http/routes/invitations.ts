import { FastifyInstance } from 'fastify'

import { createInvitation } from '__http/controllers/invitations'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function invitationsRoutes(app: FastifyInstance) {
  app.post('/:id', { preHandler: [validateAccessToken] }, createInvitation)
}
