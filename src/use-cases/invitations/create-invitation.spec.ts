import { faker } from '@faker-js/faker'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { ReceiveInvitation } from '__amqp/channels/receive-invitation'
import { SendInvitation } from '__amqp/channels/send-invitation'
import { startCacheConnection } from '__libs/cache'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createUser } from '__tests/factories/user-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { CreateInvitation } from './create-invitation'

let usersRepository: UsersRepository
let invitationsRepository: InvitationsRepository
let createInvitation: CreateInvitation
let sendInvitation: SendInvitation
let receiveInvitation: ReceiveInvitation

beforeEach(async () => {
  usersRepository = new UsersRepository()
  invitationsRepository = new InvitationsRepository()
  sendInvitation = new SendInvitation()
  receiveInvitation = new ReceiveInvitation()

  createInvitation = new CreateInvitation(
    usersRepository,
    invitationsRepository,
    sendInvitation,
  )
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

    const message = await new Promise((resolve) => {
      receiveInvitation.execute({ recipientId, resolve }).then(async () => {
        const { invitation } = await createInvitation.execute({
          content: 'Hi there!',
          recipientId,
          senderId,
        })

        expect(invitation).toEqual({
          id: expect.any(String),
          recipientId: expect.any(String),
          senderId: expect.any(String),
          content: expect.any(String),
          createdAt: expect.any(String),
        })
      })
    })

    expect(message).toEqual('Hi there!')
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
