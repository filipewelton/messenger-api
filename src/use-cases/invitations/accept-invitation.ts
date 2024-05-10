import { ContactsRepository } from '__repositories/contacts-repository'
import { InvitationsRepository } from '__repositories/invitations-repository'
import { UsersRepository } from '__repositories/users-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

interface Params {
  senderId: string
  recipientId: string
}

export class AcceptInvitation implements UseCase {
  constructor(
    private usersRepository: UsersRepository,
    private contactsRepository: ContactsRepository,
    private invitationsRepository: InvitationsRepository,
  ) {}

  async execute(params: Params) {
    const { recipientId, senderId } = params

    const senderUser = await this.usersRepository.findById(senderId)

    if (!senderUser) {
      throw new ResourceNotFoundError('Sender user was not found.')
    }

    const key = `${senderId}:${recipientId}`
    const invitation = await this.invitationsRepository.findByKey(key)

    if (!invitation) {
      throw new ResourceNotFoundError('Invitation was not found.')
    }

    await this.invitationsRepository.deleteByKey(key)

    const contact = await this.contactsRepository.create({
      user1_id: senderId,
      user2_id: recipientId,
    })

    return { contact }
  }
}
