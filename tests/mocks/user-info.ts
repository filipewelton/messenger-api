import { faker } from '@faker-js/faker'
import { vi } from 'vitest'

import * as userInfo from '__utils/user-info'

const spy = vi.spyOn(userInfo, 'getUserInfo')

spy.mockReturnValue(
  Promise.resolve({
    avatar: faker.internet.url(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
  }),
)
