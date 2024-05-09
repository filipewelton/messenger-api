import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
import { beforeEach, describe, expect, it } from 'vitest'

import { UsersRepository } from '__repositories/in-memory/users-repository'
import { createUser } from '__tests/factories/user-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { DeleteUser } from './delete-user'

let repository: UsersRepository
let deleteUser: DeleteUser

beforeEach(() => {
  repository = new UsersRepository()
  deleteUser = new DeleteUser(repository)
})

describe('User deletion', () => {
  it('should be able to delete', async () => {
    execSync('npm run knex migrate:latest')

    const { id } = await createUser({ repository })

    await deleteUser.execute(id)

    execSync('npm run knex migrate:rollback --all')
  })

  it('should not be able to delete due to id inexistent', async () => {
    const id = faker.string.uuid()
    expect(deleteUser.execute(id)).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
