import { app } from '__http/app'
import { env } from '__libs/environment'

app.listen({ port: env.PORT }, (error) => {
  if (error) throw error
  console.log('HTTP server is running')
})
