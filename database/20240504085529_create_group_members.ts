import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('GroupMembers', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.uuid('group_id').notNullable()
    table
      .foreign('group_id')
      .references('id')
      .inTable('Groups')
      .onDelete('CASCADE')
    table.uuid('user_id').notNullable()
    table
      .foreign('user_id')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
    table.enum('role', ['admin', 'member']).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('GroupMembers')
}
