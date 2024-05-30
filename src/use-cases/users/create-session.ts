import { FastifyRequest } from 'fastify'
import { sign } from 'jsonwebtoken'

import { env } from '__libs/environment'
import { User, UsersRepository } from '__repositories/users-repository'
import { getAccessTokenFromAuthorizationCodeFlow } from '__utils/authorization-code-flow'
import { OAuthProviders, getUserInfo } from '__utils/user-info'

import { UseCase } from '../use-case'

interface Params {
  provider: OAuthProviders
  request: FastifyRequest
}

export class CreateUserSession implements UseCase {
  constructor(private repository: UsersRepository) {}

  async execute(params: Params) {
    const oauthToken = await getAccessTokenFromAuthorizationCodeFlow(
      params.request,
    )

    const userInfo = await getUserInfo({
      provider: params.provider,
      token: oauthToken,
    })

    const userWithSameEmail = await this.repository.findByEmail(userInfo.email)
    let user: User

    if (!userWithSameEmail) {
      user = await this.repository.create({
        ...userInfo,
        provider: params.provider,
      })
    } else {
      user = userWithSameEmail
    }

    const sessionToken = sign({ userId: user.id }, env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
    })

    return { user, sessionToken }
  }
}
