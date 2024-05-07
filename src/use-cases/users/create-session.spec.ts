import { execSync } from 'child_process'
import { FastifyRequest } from 'fastify'
import { afterAll, beforeAll, beforeEach, expect, it } from 'vitest'

import { UsersRepository } from '__repositories/in-memory/users-repository'
import '__tests/mocks/authorization-code-flow'
import '__tests/mocks/user-info'

import { CreateUserSession } from './create-session'

let repository: UsersRepository
let useCase: CreateUserSession

beforeAll(async () => {
  execSync('npm run knex migrate:latest')
})

beforeEach(() => {
  repository = new UsersRepository()
  useCase = new CreateUserSession(repository)
})

afterAll(() => {
  execSync('npm run knex migrate:rollback --all')
})

it('should be able to create', async () => {
  const { user, accessToken } = await useCase.execute({
    provider: 'github',
    request: {} as FastifyRequest,
  })

  expect(accessToken).toEqual(expect.any(String))

  expect(user).toEqual({
    id: expect.any(String),
    avatar: expect.any(String),
    bio: null,
    name: expect.any(String),
    email: expect.any(String),
    provider: 'github',
  })
})