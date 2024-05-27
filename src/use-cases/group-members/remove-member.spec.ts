import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { GroupsRepository } from '__repositories/in-memory/groups-repository'
import { createGroup } from '__tests/factories/group-creation'
import { createGroupMember } from '__tests/factories/group-member-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { RemoveMember } from './remove-member'

let groupsRepository: GroupsRepository
let groupMembersRepository: GroupMembersRepository
let sut: RemoveMember

beforeEach(() => {
  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
  sut = new RemoveMember(groupMembersRepository)
})

describe('Removing member to the group', () => {
  it('should be able to remove a member to the group', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      role: 'admin',
      userId: sessionUserId,
    })

    const { id: memberId } = await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      role: 'member',
      userId: faker.string.uuid(),
    })

    await sut.execute({
      groupId,
      memberId,
      sessionUserId,
    })
  })

  it('should not be able to remove a member from the group a non-existent member', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()
    const memberId = faker.string.uuid()

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      role: 'admin',
      userId: sessionUserId,
    })

    expect(
      sut.execute({
        sessionUserId,
        memberId,
        groupId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
