import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UsersRepository } from '__repositories/knex/users-repository'
import { CreateUserSession } from '__use-cases/users/create-session'
import { UpdateUser } from '__use-cases/users/update-user'
import { RouteNotFoundError } from '__utils/errors/route-not-found'

export async function createSession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({ provider: z.enum(['github']) })
  const queries = schema.safeParse(request.query)

  if (!queries.success) throw new RouteNotFoundError()

  const repository = new UsersRepository()
  const createUserSession = new CreateUserSession(repository)

  const { user, accessToken } = await createUserSession.execute({
    request,
    provider: queries.data.provider,
  })

  const maxAge = 60 * 60 * 24 * 7 // 7 days

  return reply
    .status(201)
    .setCookie('access_token', accessToken, { maxAge })
    .send({ user })
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const params = z.object({ id: z.string().uuid() }).safeParse(request.params)

  if (!params.success) throw new RouteNotFoundError()

  const body = z
    .object({
      name: z.string().optional(),
      avatar: z.string().optional().nullish(),
      bio: z.string().optional().nullish(),
    })
    .parse(request.body)

  const repository = new UsersRepository()
  const updateUser = new UpdateUser(repository)

  const { user: updatedUser } = await updateUser.execute({
    id: params.data.id,
    data: body,
  })

  return reply.status(200).send({ user: updatedUser })
}
