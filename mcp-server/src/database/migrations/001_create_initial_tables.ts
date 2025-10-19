import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create employees table first (referenced by programs)
  await knex.schema.createTable('employees', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('job_title').notNullable();
    table.string('email').notNullable();
    table.timestamps(true, true); // created_at, updated_at with defaults
  });

  // Create programs table
  await knex.schema.createTable('programs', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.uuid('manager_id').notNullable();
    table.timestamps(true, true);

    // Foreign key constraint
    table.foreign('manager_id').references('id').inTable('employees').onDelete('RESTRICT');

    // Unique constraint - one manager per program
    table.unique(['manager_id']);
  });

  // Create contracts table
  await knex.schema.createTable('contracts', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.uuid('program_id').notNullable();
    table.timestamps(true, true);

    // Foreign key constraint
    table.foreign('program_id').references('id').inTable('programs').onDelete('CASCADE');
  });

  // Create tags table
  await knex.schema.createTable('tags', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);

    // Unique constraint on tag names
    table.unique(['name']);
  });

  // Create tasks table
  await knex.schema.createTable('tasks', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.integer('completion_value').notNullable().defaultTo(0);
    table.uuid('contract_id').notNullable();
    table.timestamps(true, true);

    // Foreign key constraint
    table.foreign('contract_id').references('id').inTable('contracts').onDelete('CASCADE');

    // Check constraint for completion_value (0-10)
    table.check('completion_value >= 0 AND completion_value <= 10');
  });

  // Create task_assignments junction table (many-to-many: tasks <-> employees)
  await knex.schema.createTable('task_assignments', table => {
    table.uuid('id').primary();
    table.uuid('task_id').notNullable();
    table.uuid('employee_id').notNullable();
    table.timestamps(true, true);

    // Foreign key constraints
    table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.foreign('employee_id').references('id').inTable('employees').onDelete('CASCADE');

    // Unique constraint to prevent duplicate assignments
    table.unique(['task_id', 'employee_id']);
  });

  // Create task_tags junction table (many-to-many: tasks <-> tags)
  await knex.schema.createTable('task_tags', table => {
    table.uuid('id').primary();
    table.uuid('task_id').notNullable();
    table.uuid('tag_id').notNullable();
    table.timestamps(true, true);

    // Foreign key constraints
    table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');

    // Unique constraint to prevent duplicate tag assignments
    table.unique(['task_id', 'tag_id']);
  });
}
export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order of creation (handle foreign key dependencies)
  await knex.schema.dropTableIfExists('task_tags');
  await knex.schema.dropTableIfExists('task_assignments');
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('contracts');
  await knex.schema.dropTableIfExists('programs');
  await knex.schema.dropTableIfExists('employees');
}
