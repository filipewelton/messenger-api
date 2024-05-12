import { startServer } from 'fake-storage-service'

import { app } from '__http/app'
import { env } from '__libs/environment'

app.listen({ port: env.PORT }, (error) => {
  if (error) throw error
  console.log('HTTP server is running')
})

startServer({
  host: env.STORAGE_SERVICE_HOST,
  port: env.STORAGE_SERVICE_PORT,
}).then(() => console.log('Storage service is running'))
