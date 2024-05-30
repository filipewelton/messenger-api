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

beforeAll(async () => await app.ready())

beforeEach(() => {
  usersRepository = new UsersRepository()
})

afterAll(async () => await app.close())

describe('Group creation', () => {
  it('should be able to create group', async () => {
    const { id: userId } = await createUser({ repository: usersRepository })
    const { bearerToken } = createSession({ userId })

    const { status, body } = await supertest(app.server)
      .post('/groups')
      .set('Authorization', bearerToken)
      .send({ name: faker.lorem.words() })

    expect(status).toEqual(201)

    expect(body.group).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cover: null,
      description: null,
      members: expect.any(Array),
    })
  })
})

describe('Group deletion', () => {
  it('should be able to delete group', async () => {
    const { id: userId } = await createUser({ repository: usersRepository })
    const { bearerToken } = createSession({ userId })
    const groupsRepository = new GroupsRepository()
    const groupMemberRepository = new GroupMembersRepository()
    const { id: groupId } = await createGroup({ repository: groupsRepository })

    await createGroupMember({
      groupId,
      userId,
      repository: groupMemberRepository,
    })

    const { status } = await supertest(app.server)
      .delete(`/groups/${groupId}`)
      .set('Authorization', bearerToken)

    expect(status).toEqual(204)
  })
})

describe('Group update', () => {
  it('should be able to update group', async () => {
    const { id: userId } = await createUser({ repository: usersRepository })
    const { bearerToken } = createSession({ userId })
    const groupsRepository = new GroupsRepository()
    const groupMemberRepository = new GroupMembersRepository()
    const { id: groupId } = await createGroup({ repository: groupsRepository })
    const name = faker.lorem.word()
    const cover = faker.internet.url()
    const description = faker.lorem.words()

    await createGroupMember({
      groupId,
      userId,
      repository: groupMemberRepository,
    })

    const { status, body } = await supertest(app.server)
      .patch(`/groups/${groupId}`)
      .set('Authorization', bearerToken)
      .send({ name, cover, description })

    expect(status).toEqual(200)

    expect(body.group).toEqual({
      id: expect.any(String),
      name,
      cover,
      description,
    })
  })
})
