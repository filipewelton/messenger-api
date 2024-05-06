import axios from 'axios'
import lodash from 'lodash'

import { ResourceNotFoundError } from '__utils/errors/resource-not-found'

export type OAuthProviders = 'github'

export interface Params {
  provider: OAuthProviders
  token: string
}

type UserInfo = {
  name: string
  email: string
  avatar: string
}

const urls = {
  github: 'https://api.github.com/user',
}

export async function getUserInfo(params: Params): Promise<UserInfo> {
  return await axios
    .get(urls[params.provider], {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    })
    .then((response) => {
      const userInfo = {
        ...lodash.pick(response.data, ['email', 'name']),
        avatar: response.data.avatar_url,
      }

      return userInfo
    })
    .catch((error) => {
      throw new ResourceNotFoundError(error)
    })
}
