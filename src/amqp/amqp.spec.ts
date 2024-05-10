import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

import { ReceiveInvitation } from './channels/receive-invitation'
import { SendInvitation } from './channels/send-invitation'

describe('Invitations', () => {
  it('should be able to send message', async () => {
    const recipientId = 'user-id'
    const message = faker.lorem.words()
    const sendInvitation = new SendInvitation()
    const receiveInvitation = new ReceiveInvitation()

    const invitation = await new Promise((resolve) => {
      receiveInvitation.execute({ recipientId, resolve }).then(() => {
        sendInvitation.execute({ message, recipientId })
      })
    })

    expect(invitation).toEqual(message)
  })
})
