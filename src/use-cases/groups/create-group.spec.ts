import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { GroupsRepository } from '__repositories/in-memory/groups-repository'
import '__tests/mocks/authorization-code-flow'
import '__tests/mocks/user-info'

import { CreateGroup } from './create-group'

let groupsRepository: GroupsRepository
let groupMembersRepository: GroupMembersRepository
let sut: CreateGroup

beforeEach(() => {
  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
  sut = new CreateGroup(groupsRepository, groupMembersRepository)
})

describe('Group creation', () => {
  it('should be able to create', async () => {
    const { group } = await sut.execute({
      name: faker.lorem.word(),
      sessionUserId: faker.string.uuid(),
    })

    expect(group).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cover: null,
      description: null,
      members: expect.any(Array),
    })
  })
})
