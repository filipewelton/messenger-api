import { UpdateParams, UsersRepository } from '__repositories/users-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

export class UpdateUser implements UseCase {
  constructor(private repository: UsersRepository) {}

  async execute(params: UpdateParams) {
    const user = await this.repository.findById(params.id)

    if (!user) throw new ResourceNotFoundError('User not found.')

    const updatedUser = await this.repository.update(params)

    return { user: updatedUser }
  }
}
