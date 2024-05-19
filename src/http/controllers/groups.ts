import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { GroupMembersRepository } from '__repositories/knex/group-members-repository'
import { GroupsRepository } from '__repositories/knex/groups-repository'
import { CreateGroup } from '__use-cases/groups/create-group'
import { DeleteGroup } from '__use-cases/groups/delete-group'
import { UpdateGroup } from '__use-cases/groups/update-group'
import { RouteNotFoundError } from '__utils/errors/route-not-found'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = z
    .object({
      name: z.string().max(50),
    })
    .parse(request.body)

  const groupsRepository = new GroupsRepository()
  const groupMembersRepository = new GroupMembersRepository()
  const createGroup = new CreateGroup(groupsRepository, groupMembersRepository)

  const { group } = await createGroup.execute({
    name: body.name,
    sessionUserId: request.sessionUserId!,
  })

  return reply.status(201).send({ group })
}

export async function del(request: FastifyRequest, reply: FastifyReply) {
  const params = z
    .object({
      id: z.string().uuid(),
    })
    .safeParse(request.params)

  if (!params.success) throw new RouteNotFoundError()

  const groupsRepository = new GroupsRepository()
  const groupMembersRepository = new GroupMembersRepository()
  const deleteGroup = new DeleteGroup(groupsRepository, groupMembersRepository)

  await deleteGroup.execute({
    groupId: params.data.id,
    sessionUserId: request.sessionUserId!,
  })

  return reply.status(204).send()
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const params = z
    .object({
      id: z.string().uuid(),
    })
    .safeParse(request.params)

  if (!params.success) throw new RouteNotFoundError()

  const body = z
    .object({
      name: z.string().max(50).optional(),
      cover: z.string().optional(),
      description: z.string().optional(),
    })
    .parse(request.body)

  const groupsRepository = new GroupsRepository()
  const groupMembersRepository = new GroupMembersRepository()
  const updateGroup = new UpdateGroup(groupsRepository, groupMembersRepository)

  const { group } = await updateGroup.execute({
    data: body,
    id: params.data.id,
    sessionUserId: request.sessionUserId!,
  })

  return reply.status(200).send({ group })
}
