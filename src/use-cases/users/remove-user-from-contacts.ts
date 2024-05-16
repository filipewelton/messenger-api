import { MessageBroker } from '__amqp/message-broker'
import { ContactsRepository } from '__repositories/contacts-repository'
import { ResourceNotFoundError } from '__utils/errors/resource-not-found'
import { UnauthorizedError } from '__utils/errors/unauthorized'

import { UseCase } from '../use-case'

interface Params {
  contactId: string
  sessionUserId: string
}

export class RemoveUserFromContacts implements UseCase {
  constructor(
    private contactsRepository: ContactsRepository,
    private messageBroker: MessageBroker,
  ) {}

  async execute(params: Params) {
    const { sessionUserId, contactId } = params
    const contact = await this.contactsRepository.findById(contactId)

    if (!contact) {
      throw new ResourceNotFoundError('The contact was not found.')
    }

    const ids = [contact.user1_id, contact.user2_id]

    if (!ids.includes(sessionUserId)) {
      throw new UnauthorizedError(
        'You do not have permission for this feature.',
      )
    }

    await this.contactsRepository.delete(contact.id)

    const message = `<${sessionUserId}> removed you from his contacts.`
    const recipientId =
      sessionUserId === contact.user1_id ? contact.user2_id : contact.user1_id

    await this.messageBroker.send({
      recipientId,
      message: Buffer.from(message),
    })
  }
}
