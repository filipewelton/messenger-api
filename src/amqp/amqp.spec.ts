import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

import { AMQP } from './amqp'

describe('Invitations', () => {
  it('should be able to send message', async () => {
    const recipientId = 'user-id'
    const message = Buffer.from(faker.lorem.words())
    const amqp = new AMQP()

    await amqp.startConnection()

    const invitation = await new Promise<string>((resolve) => {
      amqp.receiveExclusiveMessage({ recipientId, resolve }).then(() => {
        amqp.sendExclusiveMessage({ message, recipientId })
      })
    })

    expect(invitation).toEqual(message.toString())
  })
})
