import { ContactsRepository } from '__repositories/contacts-repository'

interface Params {
  repository: ContactsRepository
  user1Id: string
  user2Id: string
}

export async function createContact(params: Params) {
  const { repository, user1Id, user2Id } = params
  return await repository.create({ user1_id: user1Id, user2_id: user2Id })
}
