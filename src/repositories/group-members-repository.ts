export type GroupMemberRoles = 'admin' | 'member'

export type GroupMember = {
  id: string
  group_id: string
  user_id: string
  role: GroupMemberRoles
}

export type GroupMemberCreationParams = Omit<GroupMember, 'id'>

export type GroupMemberUpdateParams = {
  id: string
  role: GroupMemberRoles
}

export abstract class GroupMembersRepository {
  protected abstract db: unknown

  public abstract create(
    params: GroupMemberCreationParams,
  ): Promise<GroupMember>

  public abstract delete(id: string): Promise<void>

  public abstract findByUserInGroup(
    userId: string,
    groupId: string,
  ): Promise<GroupMember | null>

  public abstract findManyByGroupId(id: string): Promise<GroupMember[]>

  public abstract update(params: GroupMemberUpdateParams): Promise<GroupMember>
}
