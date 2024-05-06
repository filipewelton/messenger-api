import { execSync } from 'child_process'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '__http/app'
import '__tests/mocks/authorization-code-flow'
import '__tests/mocks/user-info'

beforeAll(async () => {
  execSync('npm run knex migrate:latest')
  await app.ready()
})

afterAll(async () => {
  await app.close()
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
