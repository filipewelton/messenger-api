import { startCacheConnection } from '__libs/cache'
import { ConflictError } from '__utils/errors/conflict'

import {
  CreationParams,
  Invitation,
  InvitationsRepository as Repository,
} from '../invitations-repository'

export class InvitationsRepository extends Repository {
  async create(params: CreationParams): Promise<Invitation> {
    const id = `${params.senderId}:${params.recipientId}`
    const cache = await startCacheConnection()
    const hasSameKey = await cache.keys(id)

    if (hasSameKey.length !== 0) {
      throw new ConflictError('Invitation already was created.')
    }

    const threeDaysInSeconds = 60 * 60 * 24 * 3

    const invitation: Invitation = {
      ...params,
      id,
      createdAt: new Date().toISOString(),
    }

    await cache.json.set(id, '.', invitation)
    await cache.expire(id, threeDaysInSeconds)

    return invitation
  }

  async delete(id: string): Promise<void> {
    const cache = await startCacheConnection()
    await cache.del(id)
  }

  async findByUserId(id: string): Promise<Invitation[] | null> {
    const cache = await startCacheConnection()
    const keys = await cache.keys(`*${id}*`)

    if (keys.length === 0) return null

    const invitations: Invitation[] = []

    for await (const k of keys) {
      const invitation = await cache.json.get(k)
      invitations.push(invitation as Invitation)
    }

    return invitations
  }
}
