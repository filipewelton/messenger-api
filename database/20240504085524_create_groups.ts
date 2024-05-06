import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Groups', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('name', 50).notNullable()
    table.string('description', 120)
    table.string('cover')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Groups')
}
