import { GroupMembersRepository } from '__repositories/group-members-repository'
import { GroupsRepository } from '__repositories/groups-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

export class DeleteGroup implements UseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private groupMembersRepository: GroupMembersRepository,
  ) {}

  async execute(id: string) {
    const group = await this.groupsRepository.findById(id)

    if (!group) throw new ResourceNotFoundError('Group not found.')

    const groupMembers = await this.groupMembersRepository.findManyByGroupId(id)

    for await (const member of groupMembers) {
      await this.groupMembersRepository.delete(member.id)
    }

    await this.groupsRepository.delete(id)
  }
}
