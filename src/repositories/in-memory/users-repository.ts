import { randomUUID } from 'crypto'

import {
  CreationParams,
  UsersRepository as Repositories,
  UpdateParams,
  User,
} from '__repositories/users-repository'

export class UsersRepository extends Repositories {
  protected db: User[] = []

  async create(params: CreationParams): Promise<User> {
    const user: User = {
      ...params,
      id: randomUUID(),
      bio: null,
    }

    this.db.push(user)
    return user
  }

  async delete(id: string): Promise<void> {
    const index = this.db.findIndex((user) => user.id === id)
    delete this.db[index]
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.db.find((user) => user.email === email)
    return user ?? null
  }

  async findById(id: string): Promise<User | null> {
    const user = this.db.find((user) => user.id === id)
    return user ?? null
  }

  async update(params: UpdateParams): Promise<User> {
    const index = this.db.findIndex((user) => user.id === params.id)
    const updatedUser: User = {
      ...this.db[index],
      ...params.data,
    }

    this.db[index] = updatedUser
    return updatedUser
  }
}
