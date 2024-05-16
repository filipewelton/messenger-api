import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { GroupsRepository } from '__repositories/in-memory/groups-repository'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { createGroup } from '__tests/factories/group-creation'
import { createGroupMember } from '__tests/factories/group-member-creation'
import { createUser } from '__tests/factories/user-creation'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UpdateGroup } from './update-group'

let groupsRepository: GroupsRepository
let groupMembersRepository: GroupMembersRepository
let usersRepository: UsersRepository
let sut: UpdateGroup

beforeEach(() => {
  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
  usersRepository = new UsersRepository()
  sut = new UpdateGroup(groupsRepository, groupMembersRepository)
})

describe('Group update', () => {
  it('should be able to update group', async () => {
    const { id: userId } = await createUser({ repository: usersRepository })
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const cover = faker.internet.url()
    const description = faker.lorem.words()
    const name = faker.lorem.word()

    await createGroupMember({
      groupId,
      userId,
      repository: groupMembersRepository,
    })

    const { group } = await sut.execute({
      id: groupId,
      sessionUserId: userId,
      data: { cover, description, name },
    })

    expect(group).toEqual({
      id: expect.any(String),
      name,
      cover,
      description,
    })
  })

  it('should not be able to update due to insufficient permissions', async () => {
    const { id: userId } = await createUser({ repository: usersRepository })
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const cover = faker.internet.url()
    const description = faker.lorem.words()
    const name = faker.lorem.word()

    await createGroupMember({
      groupId,
      userId,
      repository: groupMembersRepository,
      role: 'member',
    })

    expect(
      sut.execute({
        id: groupId,
        sessionUserId: userId,
        data: { cover, description, name },
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
