import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { GroupsRepository } from '__repositories/in-memory/groups-repository'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { createGroup } from '__tests/factories/group-creation'
import { createGroupMember } from '__tests/factories/group-member-creation'
import { createUser } from '__tests/factories/user-creation'
import '__tests/mocks/authorization-code-flow'
import '__tests/mocks/user-info'
import { ConflictError } from '__utils/errors/conflict'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { AddMember } from './add-member'

let groupsRepository: GroupsRepository
let groupMembersRepository: GroupMembersRepository
let usersRepository: UsersRepository
let sut: AddMember

beforeEach(() => {
  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
  usersRepository = new UsersRepository()
  sut = new AddMember(groupsRepository, groupMembersRepository, usersRepository)
})

describe('Adding member to group', () => {
  it('should be able to add a member to group', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      role: 'admin',
      userId: sessionUserId,
    })

    const { id: userId } = await createUser({
      repository: usersRepository,
    })

    const { groupMember } = await sut.execute({
      sessionUserId,
      group_id: groupId,
      user_id: userId,
    })

    expect(groupMember).toEqual({
      id: expect.any(String),
      group_id: expect.any(String),
      user_id: userId,
      role: 'member',
    })
  })

  it('should not be able to add member yourself', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })

    const { id: sessionUserId } = await createUser({
      repository: usersRepository,
    })

    expect(
      sut.execute({
        sessionUserId,
        group_id: groupId,
        user_id: sessionUserId,
      }),
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('should not be able to add a member that has already been added', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      role: 'admin',
      userId: sessionUserId,
    })

    const { id: userId } = await createUser({ repository: usersRepository })

    await createGroupMember({
      groupId,
      userId,
      repository: groupMembersRepository,
      role: 'member',
    })

    expect(
      sut.execute({
        sessionUserId,
        group_id: groupId,
        user_id: userId,
      }),
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('should not be able to add a non-existent user', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      role: 'admin',
      userId: sessionUserId,
    })

    expect(
      sut.execute({
        sessionUserId,
        group_id: groupId,
        user_id: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a member to non-existent group', async () => {
    const { id: sessionUserId } = await createUser({
      repository: usersRepository,
    })

    expect(
      sut.execute({
        sessionUserId,
        group_id: faker.string.uuid(),
        user_id: faker.string.uuid(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a member to the group because the session user is not a member', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()

    await createGroupMember({
      groupId: faker.string.uuid(),
      repository: groupMembersRepository,
      role: 'admin',
      userId: sessionUserId,
    })

    const { id: userId } = await createUser({
      repository: usersRepository,
    })

    expect(
      sut.execute({
        sessionUserId,
        group_id: groupId,
        user_id: userId,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
