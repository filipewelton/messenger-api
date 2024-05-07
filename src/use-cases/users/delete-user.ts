import { UsersRepository } from '__repositories/users-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

export class DeleteUser implements UseCase {
  constructor(private repository: UsersRepository) {}

  async execute(id: string) {
    const user = await this.repository.findById(id)

    if (!user) throw new ResourceNotFoundError('User not found.')

    await this.repository.delete(id)
  }
}
