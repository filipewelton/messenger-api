import { randomUUID } from 'crypto'

import {
  GroupMember,
  GroupMemberCreationParams,
  GroupMemberUpdateParams,
  GroupMembersRepository as Repository,
} from '__repositories/group-members-repository'

export class GroupMembersRepository extends Repository {
  protected db: GroupMember[] = []

  async create(params: GroupMemberCreationParams): Promise<GroupMember> {
    const groupMember: GroupMember = {
      ...params,
      id: randomUUID(),
    }

    this.db.push(groupMember)
    return groupMember
  }

  async delete(id: string): Promise<void> {
    this.db = this.db.filter((member) => member.id !== id)
  }

  async findByUserInGroup(
    userId: string,
    groupId: string,
  ): Promise<GroupMember | null> {
    const groupMember = this.db.find((member) => {
      return member.group_id === groupId && member.user_id === userId
    })

    return groupMember ?? null
  }

  async findManyByGroupId(id: string): Promise<GroupMember[]> {
    const groupMember = this.db.filter(
      (groupMember) => groupMember.group_id === id,
    )

    return groupMember
  }

  async findById(id: string): Promise<GroupMember | null> {
    const groupMember = this.db.find((member) => member.id === id)
    return groupMember ?? null
  }

  async update(params: GroupMemberUpdateParams): Promise<GroupMember> {
    const index = this.db.findIndex(
      (groupMember) => groupMember.id === params.id,
    )

    const updatedGroupMember: GroupMember = {
      ...this.db[index],
      role: params.role,
    }

    this.db[index] = updatedGroupMember
    return updatedGroupMember
  }
}
