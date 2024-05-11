import { randomUUID } from 'crypto'

import {
  Contact,
  CreationParams,
  ContactsRepository as Repository,
} from '../contacts-repository'

export class ContactsRepository extends Repository {
  protected db: Contact[] = []

  async create(params: CreationParams): Promise<Contact> {
    const contact = {
      ...params,
      id: randomUUID(),
    } as Contact

    this.db.push(contact)
    return contact
  }

  async findManyByUserId(id: string): Promise<Contact[]> {
    const contacts = this.db.filter((contact) => {
      return contact.user1_id === id || contact.user2_id === id
    })

    return contacts
  }

  async findById(id: string): Promise<Contact | null> {
    const contact = this.db.find((contact) => contact.id === id)
    return contact ?? null
  }

  async findByUsersId(
    user1Id: string,
    user2Id: string,
  ): Promise<Contact | null> {
    const ids = [user1Id, user2Id]

    const contact = this.db.find((contact) => {
      return ids.includes(contact.user1_id) && ids.includes(contact.user2_id)
    })

    return contact ?? null
  }

  async delete(id: string): Promise<void> {
    const index = this.db.findIndex((contact) => contact.id === id)
    delete this.db[index]
  }
}
