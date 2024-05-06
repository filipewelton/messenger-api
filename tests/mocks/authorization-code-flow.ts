import { faker } from '@faker-js/faker'
import { vi } from 'vitest'

import * as authorizationCodeFlow from '__utils/authorization-code-flow'

const spy = vi.spyOn(
  authorizationCodeFlow,
  'getAccessTokenFromAuthorizationCodeFlow',
)

spy.mockReturnValue(Promise.resolve(faker.string.uuid()))
