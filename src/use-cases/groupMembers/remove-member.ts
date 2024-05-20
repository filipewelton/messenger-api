import { GroupMembersRepository } from '__repositories/group-members-repository'
import { ConflictError } from '__utils/errors/conflict'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params {
  sessionUserId: string
  memberId: string
  groupId: string
}

export class RemoveMember implements UseCase {
  constructor(private groupMembersRepository: GroupMembersRepository) {}

  async execute(params: Params) {
    const { sessionUserId, memberId, groupId } = params

    const admin = await this.groupMembersRepository.findByUserInGroup(
      sessionUserId,
      groupId,
    )

    if (!admin || admin.role !== 'admin' || admin.group_id !== groupId) {
      throw new UnauthorizedError(
        'You do not have permission for this resource.',
      )
    }

    const member = await this.groupMembersRepository.findById(memberId)

    if (!member) throw new ResourceNotFoundError('Member not found.')

    if (member.user_id === sessionUserId) {
      throw new ConflictError("You can't remove yourself.")
    }

    await this.groupMembersRepository.delete(member.id)
  }
}
