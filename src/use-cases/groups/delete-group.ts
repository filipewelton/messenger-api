import { GroupMembersRepository } from '__repositories/group-members-repository'
import { GroupsRepository } from '__repositories/groups-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params {
  sessionUserId: string
  groupId: string
}

export class DeleteGroup implements UseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private groupMembersRepository: GroupMembersRepository,
  ) {}

  async execute(params: Params) {
    const { groupId, sessionUserId } = params
    const group = await this.groupsRepository.findById(groupId)

    if (!group) throw new ResourceNotFoundError('Group not found.')

    const admin = await this.groupMembersRepository.findByUserInGroup(
      sessionUserId,
      groupId,
    )

    if (!admin || admin.role === 'member' || admin.group_id !== groupId)
      throw new UnauthorizedError(
        'You do not have permission for this resource.',
      )

    const groupMembers =
      await this.groupMembersRepository.findManyByGroupId(groupId)

    for await (const member of groupMembers) {
      await this.groupMembersRepository.delete(member.id)
    }

    await this.groupsRepository.delete(groupId)
  }
}
