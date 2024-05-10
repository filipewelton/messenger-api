import { faker } from '@faker-js/faker'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { AMQP } from '__amqp/amqp'
import { startCacheConnection } from '__libs/cache'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createUser } from '__tests/factories/user-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { CreateInvitation } from './create-invitation'

let usersRepository: UsersRepository
let invitationsRepository: InvitationsRepository
let createInvitation: CreateInvitation
let amqp: AMQP

beforeEach(async () => {
  usersRepository = new UsersRepository()
  invitationsRepository = new InvitationsRepository()
  amqp = new AMQP()

  createInvitation = new CreateInvitation(
    usersRepository,
    invitationsRepository,
    amqp,
  )

  await amqp.startConnection()
})

afterAll(async () => {
  const cache = await startCacheConnection()
  await cache.flushAll()
})

describe('Invitation creation', () => {
  it('should be able to create', async () => {
    const { id: recipientId } = await createUser({
      repository: usersRepository,
    })

    const { id: senderId } = await createUser({
      repository: usersRepository,
    })

    const message = faker.lorem.words()
    const resolve = (receivedMessage: string) =>
      expect(receivedMessage).toEqual(message)

    await amqp.receiveExclusiveMessage({
      recipientId,
      resolve,
    })

    await createInvitation.execute({
      content: message,
      recipientId,
      senderId,
    })
  })

  it('should not be able to create due to sender user does not exists', async () => {
    const { id: recipientId } = await createUser({
      repository: usersRepository,
    })

    const senderId = faker.string.uuid()

    expect(
      createInvitation.execute({
        content: faker.lorem.words(),
        recipientId,
        senderId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create due to recipient user does not exists', async () => {
    const { id: senderId } = await createUser({
      repository: usersRepository,
    })

    const recipientId = faker.string.uuid()

    expect(
      createInvitation.execute({
        content: faker.lorem.words(),
        recipientId,
        senderId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
