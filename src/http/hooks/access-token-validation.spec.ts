import { faker } from '@faker-js/faker'
import { FastifyRequest } from 'fastify'
import { expect, it } from 'vitest'

import { UnauthorizedError } from '__utils/errors/unauthorized'

import { validateAccessToken } from './access-token-validation'

const token = faker.string.uuid()

const request = {
  headers: {
    cookie: `access_token=${token}; MaxAge=0`,
  },
} as FastifyRequest

it('should throw an unauthorized error', () => {
  expect(validateAccessToken(request)).rejects.toBeInstanceOf(UnauthorizedError)
})
