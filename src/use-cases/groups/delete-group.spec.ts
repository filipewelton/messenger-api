import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

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
  execSync('npm run knex migrate:latest')

  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
  sut = new DeleteGroup(groupsRepository, groupMembersRepository)
})

afterEach(() => {
  execSync('npm run knex migrate:rollback --all')
})

describe('Group deletion', () => {
  it('should be able to delete', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })

    await createGroupMember({
      groupId,
      userId: faker.string.uuid(),
      repository: groupMembersRepository,
    })

    await sut.execute(groupId)

    const groupsSearchResult = await groupsRepository.findById(groupId)

    const groupMembersSearchResult =
      await groupMembersRepository.findManyByGroupId(groupId)

    expect(groupsSearchResult).toBeNull()
    expect(groupMembersSearchResult).toHaveLength(0)
  })

  it('should not be able to delete due to id not found', async () => {
    const id = faker.string.uuid()
    expect(sut.execute(id)).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
