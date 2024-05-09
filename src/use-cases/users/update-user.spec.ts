import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
import { beforeEach, describe, expect, it } from 'vitest'

import { UsersRepository } from '__repositories/in-memory/users-repository'
import { createUser } from '__tests/factories/user-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UpdateUser } from './update-user'

let repository: UsersRepository
let updateUser: UpdateUser

beforeEach(() => {
  repository = new UsersRepository()
  updateUser = new UpdateUser(repository)
})

describe('User update', () => {
  it('should be able to update', async () => {
    execSync('npm run knex migrate:latest')

    const { id, name } = await createUser({ repository })

    const { user: updatedUser } = await updateUser.execute({
      id,
      data: {
        name: faker.person.fullName(),
      },
    })

    expect(name).not.toEqual(updatedUser.name)
    execSync('npm run knex migrate:rollback --all')
  })

  it('should not be able to update due to inexistent id', async () => {
    const id = faker.string.uuid()

    expect(
      updateUser.execute({
        id,
        data: {
          name: faker.person.fullName(),
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
