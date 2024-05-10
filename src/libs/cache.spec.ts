import { describe, expect, it } from 'vitest'

import { startCacheConnection } from './cache'

describe('Cache connection', () => {
  it('should be able to connection with cache', async () => {
    const cache = await startCacheConnection()
    const reply = await cache.ping()

    expect(reply).toEqual('PONG')
  })
})
