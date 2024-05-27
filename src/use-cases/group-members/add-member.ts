import {
  GroupMemberCreationParams,
  GroupMembersRepository,
} from '__repositories/group-members-repository'
import { GroupsRepository } from '__repositories/groups-repository'
import { UsersRepository } from '__repositories/users-repository'
import { ConflictError } from '__utils/errors/conflict'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params extends Omit<GroupMemberCreationParams, 'role'> {
  sessionUserId: string
}

export class AddMember implements UseCase {
  constructor(
    private groupsRepository: GroupsRepository,
    private groupMembersRepository: GroupMembersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(params: Params) {
    const { group_id, sessionUserId, user_id } = params

    if (sessionUserId === user_id) {
      throw new ConflictError('Invalid user ID.')
    }

    const group = await this.groupsRepository.findById(params.group_id)

    if (!group) throw new ResourceNotFoundError('Group not found.')

    const admin = await this.groupMembersRepository.findByUserInGroup(
      sessionUserId,
      group_id,
    )

    if (!admin || admin.role !== 'admin' || admin.group_id !== group_id) {
      throw new UnauthorizedError(
        'You do not have permission for this resource.',
      )
    }

    const user = await this.usersRepository.findById(user_id)

    if (!user) throw new ResourceNotFoundError('Invalid user ID.')

    const userAlreadyAdded =
      await this.groupMembersRepository.findByUserInGroup(user_id, group_id)

    if (userAlreadyAdded) {
      throw new ConflictError('This user already added to group.')
    }

    const groupMember = await this.groupMembersRepository.create({
      group_id: params.group_id,
      role: 'member',
      user_id: params.user_id,
    })

    return { groupMember }
  }
}
