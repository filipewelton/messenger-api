import { beforeEach, describe, expect, it } from 'vitest'

import { ContactsRepository } from '__repositories/in-memory/contacts-repository'
import { UsersRepository } from '__repositories/in-memory/users-repository'
import { InvitationsRepository } from '__repositories/node-redis/invitations-repository'
import { createInvitation } from '__tests/factories/invitation-creation'
import { createUser } from '__tests/factories/user-creation'

import { AcceptInvitation } from './accept-invitation'

let usersRepository: UsersRepository
let contactsRepository: ContactsRepository
let invitationRepository: InvitationsRepository
let acceptInvitation: AcceptInvitation

beforeEach(() => {
  usersRepository = new UsersRepository()
  contactsRepository = new ContactsRepository()
  invitationRepository = new InvitationsRepository()

  acceptInvitation = new AcceptInvitation(
    usersRepository,
    contactsRepository,
    invitationRepository,
  )
})

describe('Invitation acceptance', () => {
  it('should be able to accept invitation', async () => {
    const { id: senderId } = await createUser({ repository: usersRepository })

    const { id: recipientId } = await createUser({
      repository: usersRepository,
    })

    await createInvitation({
      recipientId,
      senderId,
      repository: invitationRepository,
    })

    const { contact } = await acceptInvitation.execute({
      recipientId,
      senderId,
    })

    expect(contact).toEqual({
      id: expect.any(String),
      user1_id: expect.any(String),
      user2_id: expect.any(String),
    })
  })
})
