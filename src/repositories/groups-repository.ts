import { GroupMember } from './group-members-repository'

export type Group = {
  id: string
  name: string
  description: string | null
  cover: string | null
  members?: GroupMember[]
}

export type GroupUpdateParams = {
  id: string
  data: {
    name?: string
    description?: string | null
    cover?: string | null
  }
}

export abstract class GroupsRepository {
  protected abstract db: unknown
  public abstract create(name: string): Promise<Group>
  public abstract delete(id: string): Promise<void>
  public abstract findById(id: string): Promise<Group | null>
  public abstract update(params: GroupUpdateParams): Promise<Group>
}
