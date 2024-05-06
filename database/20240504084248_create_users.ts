import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Users', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('avatar')
    table.string('bio')
    table.string('name').notNullable()
    table.string('email').notNullable().unique()
    table.enum('provider', ['github']).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Users')
}
