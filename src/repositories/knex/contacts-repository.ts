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

  async findByUsersId(
    user1Id: string,
    user2Id: string,
  ): Promise<Contact | null> {
    const contact = await this.db('contacts')
      .select('*')
      .where((builder) => {
        builder.where('user1_id', user1Id).and.where('user2_id', user2Id)
      })
      .or.where((builder) => {
        builder.where('user1_id', user2Id).or.where('user2_id', user1Id)
      })
      .first()

    return contact ?? null
  }

  async delete(id: string): Promise<void> {
    await this.db('contacts').where('id', id).del()
  }
}
