import { FastifyInstance } from 'fastify'

import {
  addMember,
  leaveTheGroup,
  removeMember,
  transfer,
} from '__http/controllers/group-members'
import { validateAccessToken } from '__http/hooks/access-token-validation'

export async function groupMembersRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [validateAccessToken] }, addMember)
  app.delete('/:memberId', { preHandler: [validateAccessToken] }, removeMember)
  app.delete('/leave', { preHandler: [validateAccessToken] }, leaveTheGroup)
  app.patch('/transfer', { preHandler: [validateAccessToken] }, transfer)
}
