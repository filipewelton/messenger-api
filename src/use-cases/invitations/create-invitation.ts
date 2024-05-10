import { AMQP } from '__amqp/amqp'
import {
  CreationParams,
  InvitationsRepository,
} from '__repositories/invitations-repository'
import { UsersRepository } from '__repositories/users-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

import { UseCase } from '../use-case'

export class CreateInvitation implements UseCase {
  constructor(
    private usersRepository: UsersRepository,
    private invitationsRepository: InvitationsRepository,
    private amqp: AMQP,
  ) {}

  async execute(params: CreationParams) {
    const sender = await this.usersRepository.findById(params.senderId)

    if (!sender) throw new ResourceNotFoundError('Sender user not found.')

    const recipient = await this.usersRepository.findById(params.recipientId)

    if (!recipient) throw new ResourceNotFoundError('Recipient user not found.')

    const invitation = await this.invitationsRepository.create(params)

    await this.amqp.sendExclusiveMessage({
      message: Buffer.from(params.content),
      recipientId: params.recipientId,
    })

    return { invitation }
  }
}
