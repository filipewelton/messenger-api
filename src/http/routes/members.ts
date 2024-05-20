import { FastifyInstance } from 'fastify'

import { addMember, removeMember } from '__http/controllers/members'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function membersRoutes(app: FastifyInstance) {
  app.post('/:id', { preHandler: [validateAccessToken] }, addMember)
  app.delete('/:id', { preHandler: [validateAccessToken] }, removeMember)
}
