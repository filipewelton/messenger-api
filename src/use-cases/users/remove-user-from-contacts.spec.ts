import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { MessageBroker } from '__amqp/message-broker'
import { ContactsRepository } from '__repositories/in-memory/contacts-repository'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { createContact } from '__tests/factories/contact-creation'
import { createUser } from '__tests/factories/user-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { RemoveUserFromContacts } from './remove-user-from-contacts'

let usersRepository: UsersRepository
let contactsRepository: ContactsRepository
let messageBroker: MessageBroker
let sut: RemoveUserFromContacts

beforeEach(async () => {
  usersRepository = new UsersRepository()
  contactsRepository = new ContactsRepository()
  messageBroker = new MessageBroker()
  sut = new RemoveUserFromContacts(contactsRepository, messageBroker)

  await messageBroker.open()
})

describe('Removing user from contacts', () => {
  it('should be able to remove an user from contacts', async () => {
    const { id: user1Id } = await createUser({ repository: usersRepository })

    const { id: user2Id } = await createUser({
      repository: usersRepository,
    })

    const { id: contactId } = await createContact({
      user1Id,
      user2Id,
      repository: contactsRepository,
    })

    const resolver = (msg: string) =>
      expect(msg).toEqual(`<${user1Id}> removed you from his contacts.`)

    await messageBroker.receive({
      resolver,
      recipientId: user2Id,
    })

    await sut.execute({
      contactId,
      sessionUserId: user1Id,
    })
  })

  it('should not be able to remove due to non-existent contact', async () => {
    const { id: user1Id } = await createUser({ repository: usersRepository })

    expect(
      sut.execute({
        sessionUserId: user1Id,
        contactId: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
