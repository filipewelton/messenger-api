import cookies from '@fastify/cookie'
import oauth2 from '@fastify/oauth2'
import fastify from 'fastify'

import { CustomError } from '__utils/errors/custom-error'

import { githubStrategy } from './oauth-strategies/github'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(cookies)
app.register(oauth2, githubStrategy)
app.register(usersRoutes, { prefix: 'users' })

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof CustomError) {
    return reply
      .status(error.status)
      .send({ message: error.message, reason: error.reason })
  }

  console.log(error)
  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
