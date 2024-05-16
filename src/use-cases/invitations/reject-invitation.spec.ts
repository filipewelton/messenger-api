import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { MessageBroker } from '__amqp/message-broker'
import { CacheClient, startCacheConnection } from '__libs/cache'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createInvitation } from '__tests/factories/invitation-creation'
import { createUser } from '__tests/factories/user-creation'

import { RejectInvitation } from './reject-invitation'

let usersRepository: UsersRepository
let invitationsRepository: InvitationsRepository
let messageBroker: MessageBroker
let cache: CacheClient
let sut: RejectInvitation

beforeEach(async () => {
  usersRepository = new UsersRepository()
  invitationsRepository = new InvitationsRepository()
  messageBroker = new MessageBroker()
  cache = await startCacheConnection()

  sut = new RejectInvitation(
    usersRepository,
    invitationsRepository,
    messageBroker,
  )

  await messageBroker.open()
})

afterAll(async () => {
  await cache.flushAll()
})

describe('Invitation rejection', () => {
  it('should be able to reject invitation', async () => {
    const { id: recipientId } = await createUser({
      repository: usersRepository,
    })

    const { id: senderId } = await createUser({
      repository: usersRepository,
    })

    const resolver = (msg: string) =>
      expect(msg).toEqual(`<${recipientId}> rejected his invitation!`)

    await createInvitation({
      recipientId,
      senderId,
      repository: invitationsRepository,
    })

    await messageBroker.receive({
      recipientId,
      resolver,
    })

    await sut.execute({ recipientId, senderId })
  })
})
