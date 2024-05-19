import { database } from '__libs/database'
import {
  GroupMember,
  GroupMemberCreationParams,
  GroupMemberUpdateParams,
  GroupMembersRepository as Repository,
} from '__repositories/group-members-repository'

export class GroupMembersRepository extends Repository {
  protected db = database

  async create(params: GroupMemberCreationParams): Promise<GroupMember> {
    const groupMember = await this.db('groupMembers')
      .insert(params)
      .returning('*')

    return groupMember[0]
  }

  async delete(id: string): Promise<void> {
    await this.db('groupMembers').where('id', id).del()
  }

  async findByUserInGroup(
    userId: string,
    groupId: string,
  ): Promise<GroupMember | null> {
    const groupMember = await this.db('groupMembers')
      .select('*')
      .where('user_id', userId)
      .and.where('group_id', groupId)
      .first()

    return groupMember ?? null
  }

  async findManyByGroupId(id: string): Promise<GroupMember[]> {
    const groupMembers = await this.db('groupMembers')
      .select('*')
      .where('group_id', id)

    return groupMembers
  }

  async update(params: GroupMemberUpdateParams): Promise<GroupMember> {
    const updatedGroupMember = await this.db('groupMembers')
      .where('id', params.id)
      .update({ role: params.role })
      .returning('*')

    return updatedGroupMember[0]
  }
}
