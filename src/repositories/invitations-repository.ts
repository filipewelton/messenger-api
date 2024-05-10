export type Invitation = {
  id: string
  senderId: string
  recipientId: string
  createdAt: string
  content: string
}

export type CreationParams = Omit<Invitation, 'id' | 'createdAt'>

export abstract class InvitationsRepository {
  public abstract create(params: CreationParams): Promise<Invitation>
  public abstract delete(id: string): Promise<void>
  public abstract findByUserId(id: string): Promise<Invitation[] | null>
}
