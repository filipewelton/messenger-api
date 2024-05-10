export type Contact = {
  id: string
  user1_id: string
  user2_id: string
}

export type CreationParams = Omit<Contact, 'id'>

export abstract class ContactsRepository {
  protected abstract db: unknown
  public abstract create(params: CreationParams): Promise<Contact>
  public abstract findManyByUserId(id: string): Promise<Contact[]>
  public abstract delete(id: string): Promise<void>
}
