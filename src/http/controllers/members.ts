import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { GroupMembersRepository } from '__repositories/knex/group-members-repository'
import { GroupsRepository } from '__repositories/knex/groups-repository'
import { UsersRepository } from '__repositories/knex/users-repository'
import { AddMember } from '__use-cases/groupMembers/add-member'
import { RemoveMember } from '__use-cases/groupMembers/remove-member'
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

export async function removeMember(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = z.object({ id: z.string().uuid() }).safeParse(request.params)

  if (!params.success) throw new RouteNotFoundError()

  const body = z.object({ groupId: z.string().uuid() }).parse(request.body)
  const groupMembersRepository = new GroupMembersRepository()

  const useCase = new RemoveMember(groupMembersRepository)

  await useCase.execute({
    groupId: body.groupId,
    memberId: params.data.id,
    sessionUserId: request.sessionUserId!,
  })

  return reply.status(204).send()
}
