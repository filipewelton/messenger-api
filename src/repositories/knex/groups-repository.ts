import { database } from '__libs/database'
import {
  Group,
  GroupUpdateParams,
  GroupsRepository as Repository,
} from '__repositories/groups-repository'

export class GroupsRepository extends Repository {
  protected db = database

  async create(name: string): Promise<Group> {
    const group = await this.db('groups').insert({ name }).returning('*')
    return group[0]
  }

  async delete(id: string): Promise<void> {
    await this.db('groups').where('id', id).del()
  }

  async findById(id: string): Promise<Group | null> {
    const group = await this.db('groups').select('*').where('id', id).first()
    return group ?? null
  }

  async update(params: GroupUpdateParams): Promise<Group> {
    const updatedGroup = await this.db('groups')
      .where('id', params.id)
      .update(params.data)
      .returning('*')

    return updatedGroup[0]
  }
}
