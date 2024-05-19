import lodash from 'lodash'

import { GroupMembersRepository } from '__repositories/group-members-repository'
import {
  GroupUpdateParams,
  GroupsRepository,
} from '__repositories/groups-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params extends GroupUpdateParams {
  sessionUserId: string
}

export class UpdateGroup implements UseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private groupMembersRepository: GroupMembersRepository,
  ) {}

  async execute(params: Params) {
    const { sessionUserId } = params
    const group = await this.groupsRepository.findById(params.id)

    if (!group) throw new ResourceNotFoundError('Group not found.')

    const admin = await this.groupMembersRepository.findByUserInGroup(
      sessionUserId,
      group.id,
    )

    if (!admin) {
      throw new UnauthorizedError(
        'You do not have permission for this resource.',
      )
    }

    if (admin.role === 'member' || admin.group_id !== group.id) {
      throw new UnauthorizedError(
        'You do not have permission for this resource.',
      )
    }

    const updatedGroup = await this.groupsRepository.update(
      lodash.omit(params, ['sessionUserId']),
    )

    return { group: updatedGroup }
  }
}
