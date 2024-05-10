import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
import supertest from 'supertest'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { ReceiveInvitation } from '__amqp/channels/invitation-receiving'
import { app } from '__http/app'
import { UsersRepository } from '__repositories/knex/users-repository'
import { createSession } from '__tests/factories/session-creation'
import { createUser } from '__tests/factories/user-creation'

let repository: UsersRepository
let receiveInvitation: ReceiveInvitation

beforeAll(async () => await app.ready())

beforeEach(() => {
  execSync('npm run knex migrate:latest')
  repository = new UsersRepository()
  receiveInvitation = new ReceiveInvitation()
})

afterEach(() => {
  execSync('npm run knex migrate:rollback --all')
})

afterAll(async () => app.close())

describe('Invitation creation', () => {
  it('should be able to create', async () => {
    const { id: senderUserId } = await createUser({ repository })
    const { id: recipientUserId } = await createUser({ repository })
    const content = faker.lorem.words()
    const { cookie } = createSession()
    const resolve = (invitation: string) => expect(invitation).toEqual(content)

    await receiveInvitation.execute({
      resolve,
      recipientId: recipientUserId,
    })

    const { body } = await supertest(app.server)
      .post(`/invitations/${senderUserId}`)
      .set('Cookie', cookie)
      .send({
        recipientId: recipientUserId,
        content,
      })

    expect(body.invitation).toEqual({
      recipientId: expect.any(String),
      content: expect.any(String),
      senderId: expect.any(String),
      id: expect.any(String),
      createdAt: expect.any(String),
    })
  })
})
