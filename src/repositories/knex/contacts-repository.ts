import { database } from '__libs/database'

import {
  Contact,
  CreationParams,
  ContactsRepository as Repository,
} from '../contacts-repository'

export class ContactsRepository extends Repository {
  protected db = database

  async create(params: CreationParams): Promise<Contact> {
    const contact = await this.db('contacts').insert(params).returning('*')
    return contact[0]
  }

  async findManyByUserId(id: string): Promise<Contact[]> {
    return await this.db('contacts')
      .select('*')
      .where('user1_id', id)
      .or.where('user2_id', id)
  }

  async findById(id: string): Promise<Contact | null> {
    const contact = await this.db('contacts')
      .select('*')
      .where('id', id)
      .first()

    return contact ?? null
  }

  async delete(id: string): Promise<void> {
    await this.db('contacts').where('id', id).del()
  }
}
