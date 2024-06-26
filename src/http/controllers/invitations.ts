import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { MessageBroker } from '__amqp/message-broker'
import { ContactsRepository } from '__repositories/knex/contacts-repository'
import { UsersRepository } from '__repositories/knex/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { AcceptInvitation } from '__use-cases/invitations/accept-invitation'
import { CreateInvitation } from '__use-cases/invitations/create-invitation'
import { RejectInvitation } from '__use-cases/invitations/reject-invitation'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = z
    .object({
      senderId: z.string().uuid(),
      recipientId: z.string().uuid(),
      content: z.string().max(50),
    })
    .parse(request.body)

  const usersRepository = new UsersRepository()
  const invitationsRepository = new InvitationsRepository()
  const contactsRepository = new ContactsRepository()
  const amqp = new MessageBroker()

  await amqp.open()

  const useCase = new CreateInvitation(
    usersRepository,
    invitationsRepository,
    contactsRepository,
    amqp,
  )

  const { invitation } = await useCase.execute({
    ...body,
    senderId: body.senderId,
  })

  return reply.status(201).send({ invitation })
}

export async function accept(request: FastifyRequest, reply: FastifyReply) {
  const params = z.object({ senderId: z.string().uuid() }).parse(request.body)
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
    senderId: params.senderId,
  })

  return reply.status(201).send({ contact })
}

export async function reject(request: FastifyRequest, reply: FastifyReply) {
  const params = z.object({ senderId: z.string().uuid() }).parse(request.body)
  const usersRepository = new UsersRepository()
  const invitationsRepository = new InvitationsRepository()
  const amqp = new MessageBroker()

  await amqp.open()

  const rejectInvitation = new RejectInvitation(
    usersRepository,
    invitationsRepository,
    amqp,
  )

  await rejectInvitation.execute({
    recipientId: request.sessionUserId!,
    senderId: params.senderId,
  })

  return reply.status(204).send()
}
