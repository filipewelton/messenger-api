import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { createGroupMember } from '__tests/factories/group-member-creation'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { LeaveTheGroup } from './leave-the-group'

let groupMemberRepository: GroupMembersRepository
let sut: LeaveTheGroup

beforeEach(() => {
  groupMemberRepository = new GroupMembersRepository()
  sut = new LeaveTheGroup(groupMemberRepository)
})

describe('Leaving the group', () => {
  it('should be able to leave the group', async () => {
    const userId = faker.string.uuid()
    const groupId = faker.string.uuid()

    await createGroupMember({
      userId,
      groupId,
      repository: groupMemberRepository,
      role: 'member',
    })

    await sut.execute({ groupId, sessionUserId: userId })
  })

  it('should not be able to leave the group due to admin role', async () => {
    const userId = faker.string.uuid()
    const groupId = faker.string.uuid()

    await createGroupMember({
      userId,
      groupId,
      repository: groupMemberRepository,
      role: 'admin',
    })

    expect(
      sut.execute({ groupId, sessionUserId: userId }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
