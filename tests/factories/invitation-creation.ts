import { faker } from '@faker-js/faker'

import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'

interface Params {
  repository: InvitationsRepository
  recipientId: string
  senderId: string
}

export async function createInvitation(params: Params) {
  return await params.repository.create({
    content: faker.lorem.words(),
    recipientId: params.recipientId,
    senderId: params.senderId,
  })
}
