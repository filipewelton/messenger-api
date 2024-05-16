import { faker } from '@faker-js/faker'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { MessageBroker } from './message-broker'

let messageBroker: MessageBroker

beforeEach(async () => {
  messageBroker = new MessageBroker()
  await messageBroker.open()
})

afterEach(async () => await messageBroker.close())

describe('Invitations', () => {
  it.only('should be able to send user message', async () => {
    const recipientId = 'user-id'
    const message = Buffer.from(faker.lorem.words())

    const reply = new Promise<string>((resolve) => {
      messageBroker
        .receive({ recipientId, resolver: resolve })
        .then(() => messageBroker.send({ message, recipientId }))
    })

    expect(await reply).toEqual(message.toString('utf-8'))
  })

  it.only('should be able to send group message', async () => {
    const groupId = faker.string.uuid()
    const message = Buffer.from(faker.lorem.words())

    const reply = new Promise<string>((resolve) => {
      messageBroker
        .receive({ groupId, resolver: resolve })
        .then(() => messageBroker.send({ message, groupId }))
    })

    expect(await reply).toEqual(message.toString('utf-8'))
  })
})
