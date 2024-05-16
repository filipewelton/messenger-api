import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { GroupMembersRepository } from '__repositories/knex/group-members-repository'
import { GroupsRepository } from '__repositories/knex/groups-repository'
import { CreateGroup } from '__use-cases/groups/create-group'

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
