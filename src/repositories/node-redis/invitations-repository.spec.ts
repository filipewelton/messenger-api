import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InvitationsRepository } from './invitations-repository'

let repository: InvitationsRepository

beforeEach(() => {
  repository = new InvitationsRepository()
})

describe('Invitation creation', () => {
  it('should be able to create', async () => {
    const invitation = await repository.create({
      content: faker.lorem.words(),
      recipientId: faker.string.uuid(),
      senderId: faker.string.uuid(),
    })

    expect(invitation).toEqual({
      id: expect.any(String),
      recipientId: expect.any(String),
      senderId: expect.any(String),
      content: expect.any(String),
      createdAt: expect.any(String),
    })
  })
})

describe('Invitation deletion', () => {
  it('should be able to delete', async () => {
    const { id } = await repository.create({
      content: faker.lorem.words(),
      recipientId: faker.string.uuid(),
      senderId: faker.string.uuid(),
    })

    await repository.deleteByKey(id)
  })
})

describe('Finding invitation by user id', () => {
  it('should be able to find by sender id', async () => {
    const { senderId } = await repository.create({
      content: faker.lorem.words(),
      recipientId: faker.string.uuid(),
      senderId: faker.string.uuid(),
    })

    const invitation = await repository.findByUserId(senderId)

    expect(invitation).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          recipientId: expect.any(String),
          senderId: expect.any(String),
          content: expect.any(String),
          createdAt: expect.any(String),
        },
      ]),
    )
  })
})
