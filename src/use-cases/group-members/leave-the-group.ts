import { GroupMembersRepository } from '__repositories/group-members-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params {
  sessionUserId: string
  groupId: string
}

export class LeaveTheGroup implements UseCase {
  constructor(private groupMembersRepository: GroupMembersRepository) {}

  async execute(params: Params) {
    const { groupId, sessionUserId } = params

    const groupMember = await this.groupMembersRepository.findByUserInGroup(
      sessionUserId,
      groupId,
    )

    if (!groupMember) {
      throw new ResourceNotFoundError('Member not found.')
    }

    if (groupMember.role === 'admin') {
      throw new UnauthorizedError(
        'You must transfer group administration to another member.',
      )
    }

    await this.groupMembersRepository.delete(groupMember.id)
  }
}
