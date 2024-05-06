export type Providers = 'github'

export type User = {
  id: string
  avatar: string | null
  bio: string | null
  email: string
  name: string
  provider: Providers
}

export type CreationParams = Omit<User, 'id' | 'bio'>

export type UpdateParams = {
  id: string
  data: {
    avatar?: string | null
    bio?: string | null
    name?: string
  }
}

export abstract class UsersRepository {
  protected abstract db: unknown
  public abstract create(params: CreationParams): Promise<User>
  public abstract delete(id: string): Promise<void>
  public abstract findByEmail(email: string): Promise<User | null>
  public abstract findById(id: string): Promise<User | null>
  public abstract update(params: UpdateParams): Promise<User>
}
