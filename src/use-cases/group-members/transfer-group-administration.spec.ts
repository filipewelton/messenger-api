import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { GroupMembersRepository } from '__repositories/in-memory/group-members-repository'
import { createGroupMember } from '__tests/factories/group-member-creation'

import { TransferGroupAdministration } from './transfer-group-administration'

let groupMembersRepository: GroupMembersRepository
let sut: TransferGroupAdministration

beforeEach(() => {
  groupMembersRepository = new GroupMembersRepository()
  sut = new TransferGroupAdministration(groupMembersRepository)
})

describe('Group administration transfer', () => {
  it('should be able to transfer group administration', async () => {
    const groupId = faker.string.uuid()
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
      role: 'admin',
      userId: faker.string.uuid(),
    })

    const { groupAdmin } = await sut.execute({
      groupId,
      memberId,
      sessionUserId,
    })

    expect(groupAdmin).toEqual(
      expect.objectContaining({
        id: memberId,
        role: 'admin',
      }),
    )
  })
})
