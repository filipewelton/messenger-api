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
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createInvitation } from '__tests/factories/invitation-creation'
import { createSession } from '__tests/factories/session-creation'
import { createUser } from '__tests/factories/user-creation'

let usersRepository: UsersRepository
let receiveInvitation: ReceiveInvitation
let invitationRepository: InvitationsRepository

beforeAll(async () => await app.ready())

beforeEach(() => {
  execSync('npm run knex migrate:latest')
  usersRepository = new UsersRepository()
  receiveInvitation = new ReceiveInvitation()
  invitationRepository = new InvitationsRepository()
})

afterEach(() => {
  execSync('npm run knex migrate:rollback --all')
})

afterAll(async () => app.close())

describe('Invitation creation', () => {
  it('should be able to create', async () => {
    const { id: senderUserId } = await createUser({
      repository: usersRepository,
    })
    const { id: recipientUserId } = await createUser({
      repository: usersRepository,
    })
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

describe('Invitation acceptance', () => {
  it('should be able to accept invitation', async () => {
    const { id: senderId } = await createUser({ repository: usersRepository })

    const { id: recipientId } = await createUser({
      repository: usersRepository,
    })

    const { cookie } = createSession({ userId: recipientId })

    await createInvitation({
      recipientId,
      senderId,
      repository: invitationRepository,
    })

    const { status, body } = await supertest(app.server)
      .post('/invitations/acceptance')
      .set('Cookie', cookie)
      .send({ recipientId, senderId })

    expect(status).toEqual(201)

    expect(body.contact).toEqual({
      id: expect.any(String),
      user1_id: expect.any(String),
      user2_id: expect.any(String),
    })
  })
})
