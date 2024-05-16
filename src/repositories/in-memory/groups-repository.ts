import { randomUUID } from 'crypto'

import {
  Group,
  GroupUpdateParams,
  GroupsRepository as Repository,
} from '__repositories/groups-repository'

export class GroupsRepository extends Repository {
  protected db: Group[] = []

  async create(name: string): Promise<Group> {
    const group = {
      name,
      id: randomUUID(),
      cover: null,
      description: null,
    } as Group

    this.db.push(group)
    return group
  }

  async delete(id: string): Promise<void> {
    this.db = this.db.filter((group) => group.id !== id)
  }

  async findById(id: string): Promise<Group | null> {
    const group = this.db.find((group) => group.id === id)
    return group ?? null
  }

  async update(params: GroupUpdateParams): Promise<Group> {
    const index = this.db.findIndex((group) => group.id === params.id)
    const updatedGroup: Group = {
      ...this.db[index],
      ...params.data,
    }

    this.db[index] = updatedGroup
    return updatedGroup
  }
}
