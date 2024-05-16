import {
  GroupMemberRoles,
  GroupMembersRepository,
} from '__repositories/group-members-repository'

interface Params {
  repository: GroupMembersRepository
  groupId: string
  userId: string
  role?: GroupMemberRoles
}

export async function createGroupMember(params: Params) {
  return await params.repository.create({
    group_id: params.groupId,
    user_id: params.userId,
    role: params.role ?? 'admin',
  })
}
