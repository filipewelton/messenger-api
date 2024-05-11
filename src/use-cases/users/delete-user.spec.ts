import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
import { beforeEach, describe, expect, it } from 'vitest'

import { ContactsRepository } from '__repositories/in-memory/contacts-repository'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { createUser } from '__tests/factories/user-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { DeleteUser } from './delete-user'

let usersRepository: UsersRepository
let contactsRepository: ContactsRepository
let deleteUser: DeleteUser

beforeEach(() => {
  usersRepository = new UsersRepository()
  contactsRepository = new ContactsRepository()
  deleteUser = new DeleteUser(usersRepository, contactsRepository)
})

describe('User deletion', () => {
  it('should be able to delete', async () => {
    execSync('npm run knex migrate:latest')

    const { id } = await createUser({ repository: usersRepository })

    await deleteUser.execute(id)

    expect(usersRepository.findById(id)).rejects.toBeInstanceOf(Error)

    execSync('npm run knex migrate:rollback --all')
  })

  it('should not be able to delete due to id inexistent', async () => {
    const id = faker.string.uuid()
    expect(deleteUser.execute(id)).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
