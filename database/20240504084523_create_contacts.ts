import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.uuid('user1_id').notNullable()
    table
      .foreign('user1_id')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
    table.uuid('user2_id').notNullable()
    table
      .foreign('user2_id')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Contacts')
}
