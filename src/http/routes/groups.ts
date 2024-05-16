import { FastifyInstance } from 'fastify'

import { create, del } from '__http/controllers/groups'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function groupsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [validateAccessToken] }, create)
  app.delete('/:id', { preHandler: [validateAccessToken] }, del)
}
