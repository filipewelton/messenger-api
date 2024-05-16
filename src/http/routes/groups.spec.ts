import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
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

beforeAll(async () => {
  await app.ready()
  execSync('npm run knex migrate:latest')
})

beforeEach(() => {
  usersRepository = new UsersRepository()
})

afterAll(async () => {
  await app.close()
  execSync('npm run knex migrate:rollback --all')
})

describe('Group creation', () => {
  it('should be able to create group', async () => {
    const { id: userId } = await createUser({ repository: usersRepository })
    const { cookie } = createSession({ userId })

    const { status, body } = await supertest(app.server)
      .post('/groups')
      .set('Cookie', cookie)
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
    const { cookie } = createSession({ userId })
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
      .set('Cookie', cookie)

    expect(status).toEqual(204)
  })
})
