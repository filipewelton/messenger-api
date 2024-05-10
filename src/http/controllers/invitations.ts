import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { SendInvitation } from '__amqp/channels/invitation-sending'
import { ContactsRepository } from '__repositories/knex/contacts-repository'
import { UsersRepository } from '__repositories/knex/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { AcceptInvitation } from '__use-cases/invitations/accept-invitation'
import { CreateInvitation } from '__use-cases/invitations/create-invitation'
import { RouteNotFoundError } from '__utils/errors/route-not-found'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const params = z
    .object({
      id: z.string().uuid(),
    })
    .safeParse(request.params)

  if (!params.success) throw new RouteNotFoundError()

  const body = z
    .object({
      recipientId: z.string().uuid(),
      content: z.string().max(50),
    })
    .parse(request.body)

  const invitationsRepository = new InvitationsRepository()
  const usersRepository = new UsersRepository()
  const sendInvitation = new SendInvitation()
  const useCase = new CreateInvitation(
    usersRepository,
    invitationsRepository,
    sendInvitation,
  )

  const { invitation } = await useCase.execute({
    ...body,
    senderId: params.data.id,
  })

  return reply.status(201).send({ invitation })
}

export async function accept(request: FastifyRequest, reply: FastifyReply) {
  const body = z
    .object({
      senderId: z.string().uuid(),
    })
    .parse(request.body)

  const usersRepository = new UsersRepository()
  const contactsRepository = new ContactsRepository()
  const invitationsRepository = new InvitationsRepository()

  const acceptInvitation = new AcceptInvitation(
    usersRepository,
    contactsRepository,
    invitationsRepository,
  )

  const { contact } = await acceptInvitation.execute({
    recipientId: request.sessionUserId!,
    senderId: body.senderId,
  })

  return reply.status(201).send({ contact })
}
