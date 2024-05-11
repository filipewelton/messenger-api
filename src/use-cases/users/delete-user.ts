import { ContactsRepository } from '__repositories/contacts-repository'
import { UsersRepository } from '__repositories/users-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

export class DeleteUser implements UseCase {
  constructor(
    private usersRepository: UsersRepository,
    private contactsRepository: ContactsRepository,
  ) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id)

    if (!user) throw new ResourceNotFoundError('User not found.')

    const contacts = await this.contactsRepository.findManyByUserId(id)

    if (contacts.length !== 0) {
      for await (const { id } of contacts) {
        await this.contactsRepository.delete(id)
      }
    }

    await this.usersRepository.delete(id)
  }
}
