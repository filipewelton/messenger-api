import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '__http/app'
import { GroupMembersRepository } from '__repositories/knex/group-members-repository'
import { GroupsRepository } from '__repositories/knex/groups-repository'
import { UsersRepository } from '__repositories/knex/users-repository'
import { createGroup } from '__tests/factories/group-creation'
import { createGroupMember } from '__tests/factories/group-member-creation'
import { createSession } from '__tests/factories/session-creation'
import { createUser } from '__tests/factories/user-creation'

let usersRepository: UsersRepository
let groupsRepository: GroupsRepository
let groupMembersRepository: GroupMembersRepository

beforeAll(async () => await app.ready())

beforeEach(() => {
  usersRepository = new UsersRepository()
  groupsRepository = new GroupsRepository()
  groupMembersRepository = new GroupMembersRepository()
})

afterAll(async () => await app.close())

describe('Adding member to the group', () => {
  it('should be able to add a member to the group', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()
    const { cookie } = createSession({ userId: sessionUserId })

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      userId: sessionUserId,
      role: 'admin',
    })

    const { id: userId } = await createUser({ repository: usersRepository })

    const { status, body } = await supertest(app.server)
      .post(`/groups/${groupId}/members`)
      .set('Cookie', cookie)
      .send({ userId })

    expect(status).toEqual(201)

    expect(body.groupMember).toEqual({
      id: expect.any(String),
      group_id: expect.any(String),
      user_id: userId,
      role: 'member',
    })
  })
})

describe('Removing member to the group', () => {
  it('should be able to remove a member to the group', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()
    const { cookie } = createSession({ userId: sessionUserId })

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      userId: sessionUserId,
      role: 'admin',
    })

    const { id: userId } = await createUser({ repository: usersRepository })

    const { id: memberId } = await createGroupMember({
      groupId,
      userId,
      repository: groupMembersRepository,
      role: 'member',
    })

    const { status } = await supertest(app.server)
      .delete(`/groups/${groupId}/members/${memberId}`)
      .set('Cookie', cookie)

    expect(status).toEqual(204)
  })
})

describe('Leave the group', () => {
  it('should be able to leave the group', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()
    const { cookie } = createSession({ userId: sessionUserId })

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      userId: sessionUserId,
      role: 'member',
    })

    const { status } = await supertest(app.server)
      .delete(`/groups/${groupId}/members/leave`)
      .set('Cookie', cookie)
      .send({ groupId })

    expect(status).toEqual(204)
  })
})

describe('Group administration transfer', () => {
  it('should be able to transfer group administration', async () => {
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const sessionUserId = faker.string.uuid()
    const { cookie } = createSession({ userId: sessionUserId })

    await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      userId: sessionUserId,
      role: 'admin',
    })

    const { id: memberId } = await createGroupMember({
      groupId,
      repository: groupMembersRepository,
      userId: faker.string.uuid(),
      role: 'member',
    })

    const { status, body } = await supertest(app.server)
      .patch(`/groups/${groupId}/members/transfer`)
      .set('Cookie', cookie)
      .send({ memberId })

    expect(status).toEqual(200)

    expect(body.groupAdmin).toEqual(
      expect.objectContaining({
        id: memberId,
        role: 'admin',
      }),
    )
  })
})
