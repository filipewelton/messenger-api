import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { GroupMembersRepository } from '__repositories/knex/group-members-repository'
import { GroupsRepository } from '__repositories/knex/groups-repository'
import { UsersRepository } from '__repositories/knex/users-repository'
import { AddMember } from '__use-cases/groupMembers/add-member'
import { RouteNotFoundError } from '__utils/errors/route-not-found'

export async function addMember(request: FastifyRequest, reply: FastifyReply) {
  const params = z.object({ id: z.string().uuid() }).safeParse(request.params)

  if (!params.success) throw new RouteNotFoundError()

  const body = z.object({ userId: z.string().uuid() }).parse(request.body)

  const groupsRepository = new GroupsRepository()
  const groupMembersRepository = new GroupMembersRepository()
  const usersRepository = new UsersRepository()

  const useCase = new AddMember(
    groupsRepository,
    groupMembersRepository,
    usersRepository,
  )

  const { groupMember } = await useCase.execute({
    group_id: params.data.id,
    sessionUserId: request.sessionUserId!,
    user_id: body.userId,
  })

  return reply.status(201).send({ groupMember })
}
