import { faker } from '@faker-js/faker'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { AMQP } from '__amqp/amqp'
import { CacheClient, startCacheConnection } from '__libs/cache'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createInvitation } from '__tests/factories/invitation-creation'
import { createUser } from '__tests/factories/user-creation'

import { RejectInvitation } from './reject-invitation'

let usersRepository: UsersRepository
let invitationsRepository: InvitationsRepository
let amqp: AMQP
let cache: CacheClient
let sut: RejectInvitation

beforeEach(async () => {
  usersRepository = new UsersRepository()
  invitationsRepository = new InvitationsRepository()
  amqp = new AMQP()
  cache = await startCacheConnection()
  sut = new RejectInvitation(usersRepository, invitationsRepository, amqp)

  await amqp.startConnection()
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

    const message = faker.lorem.words()
    const resolve = (msg: string) => expect(msg).toEqual(message)

    await createInvitation({
      recipientId,
      senderId,
      repository: invitationsRepository,
    })

    await amqp.receiveExclusiveMessage({
      recipientId,
      resolve,
    })

    await sut.execute({ recipientId, senderId })
  })
})
