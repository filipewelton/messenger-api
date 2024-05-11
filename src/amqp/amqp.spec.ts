import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { AMQP } from './amqp'

let amqp: AMQP

beforeEach(async () => {
  amqp = new AMQP()
  await amqp.startConnection()
})

describe('Invitations', () => {
  it('should be able to send exclusive message', async () => {
    const recipientId = 'user-id'
    const message = Buffer.from(faker.lorem.words())
    const resolve = (msg: string) => expect(msg).toEqual(message.toString())

    await amqp.receiveExclusiveMessage({ recipientId, resolve })
    await amqp.sendExclusiveMessage({ message, recipientId })
  })

  it('should be able to send group message', async () => {
    const groupId = faker.string.uuid()
    const message = Buffer.from(faker.lorem.words())
    const consumer1 = new AMQP()
    const consumer2 = new AMQP()
    const resolve = (msg: string) => expect(msg).toEqual(message.toString())

    await consumer1.startConnection()
    await consumer2.startConnection()
    await consumer1.receiveGroupMessage({ groupId, resolve })
    await consumer2.receiveGroupMessage({ groupId, resolve })
    await amqp.sendMessageGroup({ message, groupId })
  })
})
