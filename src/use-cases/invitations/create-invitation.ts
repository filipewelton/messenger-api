import { MessageBroker } from '__amqp/message-broker'
import { ContactsRepository } from '__repositories/contacts-repository'
import {
  CreationParams,
  InvitationsRepository,
} from '__repositories/invitations-repository'
import { UsersRepository } from '__repositories/users-repository'
import { ConflictError } from '__utils/errors/conflict'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

export class CreateInvitation implements UseCase {
  constructor(
    private usersRepository: UsersRepository,
    private invitationsRepository: InvitationsRepository,
    private contactsRepository: ContactsRepository,
    private messageBroker: MessageBroker,
  ) {}

  async execute(params: CreationParams) {
    const contact = await this.contactsRepository.findByUsersId(
      params.recipientId,
      params.senderId,
    )

    if (contact) {
      throw new ConflictError(
        'This user has already been added to your contacts.',
      )
    }

    const sender = await this.usersRepository.findById(params.senderId)

    if (!sender) throw new ResourceNotFoundError('Sender user not found.')

    const recipient = await this.usersRepository.findById(params.recipientId)

    if (!recipient) throw new ResourceNotFoundError('Recipient user not found.')

    const invitation = await this.invitationsRepository.create(params)

    await this.messageBroker.send({
      message: Buffer.from(params.content),
      recipientId: params.recipientId,
    })

    return { invitation }
  }
}
