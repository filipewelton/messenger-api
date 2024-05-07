import { database } from '__libs/database'
import {
  CreationParams,
  UsersRepository as Repository,
  UpdateParams,
  User,
} from '__repositories/users-repository'

export class UsersRepository extends Repository {
  protected db = database

  async create(params: CreationParams): Promise<User> {
    const user = await this.db('users').insert(params).returning('*')
    return user[0]
  }

  async delete(id: string): Promise<void> {
    await this.db('users').where('id', id).del()
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db('users')
      .select('*')
      .where('email', email)
      .first()

    return user ?? null
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db('users').select('*').where('id', id).first()
    return user ?? null
  }

  async update(params: UpdateParams): Promise<User> {
    const updatedUser = await this.db('users')
      .where('id', params.id)
      .update(params.data)
      .returning('*')

    return updatedUser[0]
  }
}
