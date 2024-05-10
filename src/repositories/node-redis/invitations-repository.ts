import { ConflictError } from '__utils/errors/conflict'

import {
  CreationParams,
  Invitation,
  InvitationsRepository as Repository,
} from '../invitations-repository'

export class InvitationsRepository extends Repository {
  async create(params: CreationParams): Promise<Invitation> {
    if (!this.connection) await this.startConnection()

    const id = `${params.senderId}:${params.recipientId}`
    const hasSameKey = await this.connection.keys(id)

    if (hasSameKey.length !== 0) {
      throw new ConflictError('Invitation already was created.')
    }

    const threeDaysInSeconds = 60 * 60 * 24 * 3

    const invitation: Invitation = {
      ...params,
      id,
      createdAt: new Date().toISOString(),
    }

    await this.connection.json.set(id, '.', invitation)
    await this.connection.expire(id, threeDaysInSeconds)

    return invitation
  }

  async deleteByKey(key: string): Promise<void> {
    if (!this.connection) await this.startConnection()
    await this.connection.json.del(key)
  }

  async findByKey(key: string): Promise<Invitation | null> {
    if (!this.connection) await this.startConnection()

    const reply = await this.connection.json.get(key)

    if (!reply) return null

    return reply as Invitation
  }

  async findByUserId(id: string): Promise<Invitation[]> {
    if (!this.connection) await this.startConnection()

    const keys = await this.connection.keys(`*${id}*`)

    if (keys.length === 0) return []

    const invitations: Invitation[] = []

    for await (const k of keys) {
      const invitation = await this.connection.json.get(k)
      invitations.push(invitation as Invitation)
    }

    return invitations
  }
}
