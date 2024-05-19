import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { GroupsRepository } from '__repositories/in-memory/groups-repository'
import { createGroup } from '__tests/factories/group-creation'
import { createGroupMember } from '__tests/factories/group-member-creation'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { DeleteGroup } from './delete-group'

let groupsRepository: GroupsRepository
let groupMembersRepository: GroupMembersRepository
let sut: DeleteGroup

beforeEach(() => {
  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
  sut = new DeleteGroup(groupsRepository, groupMembersRepository)
})

describe('Group deletion', () => {
  it('should be able to delete', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const userId = faker.string.uuid()

    await createGroupMember({
      groupId,
      userId,
      repository: groupMembersRepository,
    })

    await sut.execute({
      groupId,
      sessionUserId: userId,
    })

    const groupsSearchResult = await groupsRepository.findById(groupId)

    const groupMembersSearchResult =
      await groupMembersRepository.findManyByGroupId(groupId)

    expect(groupsSearchResult).toBeNull()
    expect(groupMembersSearchResult).toHaveLength(0)
  })

  it('should not be able to delete due to id not found', async () => {
    const groupId = faker.string.uuid()
    const sessionUserId = faker.string.uuid()

    expect(
      sut.execute({
        groupId,
        sessionUserId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
