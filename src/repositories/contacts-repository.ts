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
  public abstract findById(id: string): Promise<Contact | null>

  public abstract findByUsersId(
    user1Id: string,
    user2Id: string,
  ): Promise<Contact | null>

  public abstract delete(id: string): Promise<void>
}
