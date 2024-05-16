import { GroupMembersRepository } from '__repositories/group-members-repository'
import { Group, GroupsRepository } from '__repositories/groups-repository'

import { UseCase } from '../use-case'

interface GroupCreationParams {
  sessionUserId: string
  name: string
}

export class CreateGroup implements UseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private groupMembersRepository: GroupMembersRepository,
  ) {}

  async execute(params: GroupCreationParams) {
    const group = await this.groupsRepository.create(params.name)

    const adminMember = await this.groupMembersRepository.create({
      group_id: group.id,
      role: 'admin',
      user_id: params.sessionUserId,
    })

    return {
      group: {
        ...group,
        members: [adminMember],
      } as Group,
    }
  }
}
