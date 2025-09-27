import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('body');
    table.integer('priority').notNullable().defaultTo(1).checkBetween([1, 10]);
    table.date('deadline');
    table.boolean('done').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('todos');
}
