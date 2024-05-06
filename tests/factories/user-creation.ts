import { faker } from '@faker-js/faker'

import { Providers, UsersRepository } from '__repositories/users-repository'

interface Params {
  repository: UsersRepository
  email?: string
  provider?: Providers
}

export async function createUser(params: Params) {
  return params.repository.create({
    avatar: faker.internet.url(),
    email: params.email ?? faker.internet.email(),
    name: faker.person.fullName(),
    provider: params.provider ?? 'github',
  })
}
