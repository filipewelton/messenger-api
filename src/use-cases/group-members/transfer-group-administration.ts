import { GroupMembersRepository } from '__repositories/group-members-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params {
  sessionUserId: string
  groupId: string
  memberId: string
}

export class TransferGroupAdministration implements UseCase {
  constructor(private groupMembersRepository: GroupMembersRepository) {}

  async execute(params: Params) {
    const { memberId, groupId, sessionUserId } = params

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

    const newGroupAdmin = await this.groupMembersRepository.update({
      id: member.id,
      role: 'admin',
    })

    await this.groupMembersRepository.delete(admin.id)

    return { groupAdmin: newGroupAdmin }
  }
}
