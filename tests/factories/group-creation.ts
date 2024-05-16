import { faker } from '@faker-js/faker'

import { GroupsRepository } from '__repositories/groups-repository'

interface Params {
  repository: GroupsRepository
}

export async function createGroup(params: Params) {
  return await params.repository.create(faker.lorem.word())
}
