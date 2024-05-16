import { faker } from '@faker-js/faker'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { MessageBroker } from '__amqp/message-broker'
import { startCacheConnection } from '__libs/cache'
import { ContactsRepository } from '__repositories/in-memory/contacts-repository'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createContact } from '__tests/factories/contact-creation'
import { createUser } from '__tests/factories/user-creation'
import { ConflictError } from '__utils/errors/conflict'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { CreateInvitation } from './create-invitation'

let usersRepository: UsersRepository
let invitationsRepository: InvitationsRepository
let contactsRepository: ContactsRepository
let createInvitation: CreateInvitation
let messageBroker: MessageBroker

beforeEach(async () => {
  usersRepository = new UsersRepository()
  invitationsRepository = new InvitationsRepository()
  contactsRepository = new ContactsRepository()
  messageBroker = new MessageBroker()

  createInvitation = new CreateInvitation(
    usersRepository,
    invitationsRepository,
    contactsRepository,
    messageBroker,
  )

  await messageBroker.open()
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
    const resolver = (receivedMessage: string) =>
      expect(receivedMessage).toEqual(message)

    await messageBroker.receive({
      recipientId,
      resolver,
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

  it('should not be able to create due to user has already been added in contacts', async () => {
    const { id: senderId } = await createUser({
      repository: usersRepository,
    })

    const { id: recipientId } = await createUser({
      repository: usersRepository,
    })

    await createContact({
      repository: contactsRepository,
      user1Id: senderId,
      user2Id: recipientId,
    })

    expect(
      createInvitation.execute({
        content: faker.lorem.words(),
        recipientId,
        senderId,
      }),
    ).rejects.toBeInstanceOf(ConflictError)
  })
})
