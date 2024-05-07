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

import { app } from '__http/app'
import { UsersRepository } from '__repositories/knex/users-repository'
import { createSession } from '__tests/factories/session-creation'
import { createUser } from '__tests/factories/user-creation'
import '__tests/mocks/authorization-code-flow'
import '__tests/mocks/user-info'

beforeAll(async () => await app.ready())

beforeEach(() => {
  execSync('npm run knex migrate:latest')
})

afterAll(async () => await app.close())

afterEach(() => {
  execSync('npm run knex migrate:rollback --all')
})

describe('Session creation', () => {
  it('should be able to create', async () => {
    const { status, body, header } = await supertest(app.server).get(
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

    expect(header['set-cookie']).toHaveLength(1)
  })
})

describe('User update', () => {
  it('should be able to update', async () => {
    const repository = new UsersRepository()
    const { id, avatar } = await createUser({ repository })
    const { cookie } = createSession()

    const { status, body } = await supertest(app.server)
      .patch(`/users/${id}`)
      .set('Cookie', cookie)
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
    const { cookie } = createSession()

    await supertest(app.server).delete(`/users/${id}`).set('Cookie', cookie)
  })
})
