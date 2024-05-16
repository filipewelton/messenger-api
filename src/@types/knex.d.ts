// eslint-disable-next-line
import { knex } from 'knex'

import { Contact } from '__repositories/contacts-repository'
import { GroupMember } from '__repositories/group-members-repository'
import { Group } from '__repositories/groups-repository'
import { User } from '__repositories/users-repository'

declare module 'knex/types/tables' {
  export interface Tables {
    users: User
    contacts: Contact
    groups: Group
    groupMembers: GroupMember
  }
}
