import { CacheClient, startCacheConnection } from '__libs/cache'

export type Invitation = {
  id: string
  senderId: string
  recipientId: string
  createdAt: string
  content: string
}

export type CreationParams = Omit<Invitation, 'id' | 'createdAt'>

export abstract class InvitationsRepository {
  protected connection: CacheClient

  public abstract create(params: CreationParams): Promise<Invitation>
  public abstract deleteByKey(key: string): Promise<void>
  public abstract findByKey(key: string): Promise<Invitation | null>
  public abstract findByUserId(id: string): Promise<Invitation[]>

  protected async startConnection() {
    this.connection = await startCacheConnection()
  }
}
