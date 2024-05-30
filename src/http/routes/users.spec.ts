import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { MessageBroker } from '__amqp/message-broker'
import { app } from '__http/app'
import { ContactsRepository } from '__repositories/knex/contacts-repository'
import { UsersRepository } from '__repositories/knex/users-repository'
import { createContact } from '__tests/factories/contact-creation'
import { createSession } from '__tests/factories/session-creation'
import { createUser } from '__tests/factories/user-creation'
import '__tests/mocks/authorization-code-flow'
import '__tests/mocks/user-info'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => await app.close())

describe('Session creation', () => {
  it('should be able to create', async () => {
    const { status, body } = await supertest(app.server).get(
      '/users/sessions/callback?provider=github',
    )

    expect(status).toEqual(201)

    expect(body.user).toEqual({
      id: expect.any(String),
      avatar: expect.any(String),
      bio: null,
      name: expect.any(String),
      email: expect.any(String),
      provider: 'github',
    })

    expect(body.sessionToken).toEqual(expect.any(String))
  })
})

describe('User update', () => {
  it('should be able to update', async () => {
    const repository = new UsersRepository()
    const { id, avatar } = await createUser({ repository })
    const { bearerToken } = createSession()

    const { status, body } = await supertest(app.server)
      .patch(`/users/${id}`)
      .set('Authorization', bearerToken)
      .send({ avatar: faker.internet.url() })

    expect(status).toEqual(200)

    expect(body.user).toEqual({
      id: expect.any(String),
      avatar: expect.any(String),
      bio: null,
      name: expect.any(String),
      email: expect.any(String),
      provider: 'github',
    })

    expect(avatar).not.toEqual(body.user.avatar)
  })
})

describe('User deleting', () => {
  it('should be able to delete', async () => {
    const repository = new UsersRepository()
    const { id } = await createUser({ repository })
    const { bearerToken } = createSession()

    await supertest(app.server)
      .delete(`/users/${id}`)
      .set('Authorization', bearerToken)
  })
})

describe('Removing user from contacts', () => {
  it('should be able to remove a user from contacts', async () => {
    const messageBroker = new MessageBroker()
    const usersRepository = new UsersRepository()
    const contactsRepository = new ContactsRepository()
    const { id: user1Id } = await createUser({ repository: usersRepository })
    const { id: user2Id } = await createUser({ repository: usersRepository })
    const { bearerToken } = createSession({ userId: user1Id })

    const { id: contactId } = await createContact({
      repository: contactsRepository,
      user1Id,
      user2Id,
    })

    const resolver = (msg: string) =>
      expect(msg).toEqual(`<${user1Id}> removed you from his contacts.`)

    await messageBroker.open()

    await messageBroker.receive({
      resolver,
      recipientId: user2Id,
    })

    const { status } = await supertest(app.server)
      .delete(`/users/contacts/${contactId}`)
      .set('Authorization', bearerToken)

    expect(status).toEqual(204)
  })
})
