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
      .post(`/groups/members/${groupId}`)
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
