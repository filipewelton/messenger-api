import cookies from '@fastify/cookie'
import oauth2 from '@fastify/oauth2'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { CustomError } from '__utils/errors/custom-error'
import { parseZodError } from '__utils/zod-parser'

import { githubStrategy } from './oauth-strategies/github'
import { groupMembersRoutes } from './routes/group-members'
import { groupsRoutes } from './routes/groups'
import { invitationsRoutes } from './routes/invitations'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(fastifySwagger, {
  mode: 'static',
  specification: {
    path: './api-documentation.yaml',
    postProcessor: function (swaggerObject) {
      return swaggerObject
    },
    baseDir: './',
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
})

app.register(cookies)
app.register(oauth2, githubStrategy)
app.register(usersRoutes, { prefix: 'users' })
app.register(invitationsRoutes, { prefix: 'invitations' })
app.register(groupsRoutes, { prefix: 'groups' })
app.register(groupMembersRoutes, { prefix: 'groups/:groupId/members' })

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof CustomError) {
    return reply
      .status(error.status)
      .send({ message: error.message, reason: error.reason })
  } else if (error instanceof ZodError) {
    return reply.status(400).send(parseZodError(error))
  }

  console.log(error)
  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
