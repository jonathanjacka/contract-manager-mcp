import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('code_counters', table => {
    table.string('entity_type').primary();
    table.integer('current_value').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex('code_counters').insert([
    { entity_type: 'employees', current_value: 5 },
    { entity_type: 'programs', current_value: 2 },
    { entity_type: 'contracts', current_value: 3 },
    { entity_type: 'tags', current_value: 8 },
    { entity_type: 'tasks', current_value: 7 },
  ]);

  await knex.schema.createTable('employees', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.string('job_title').notNullable();
    table.string('email').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('programs', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.uuid('manager_id').notNullable();
    table.timestamps(true, true);

    table.foreign('manager_id').references('id').inTable('employees').onDelete('RESTRICT');
    table.unique(['manager_id']);
  });

  await knex.schema.createTable('contracts', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.uuid('program_id').notNullable();
    table.timestamps(true, true);

    table.foreign('program_id').references('id').inTable('programs').onDelete('CASCADE');
  });

  await knex.schema.createTable('tags', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.timestamps(true, true);

    table.unique(['name']);
  });

  await knex.schema.createTable('tasks', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.integer('completion_value').notNullable().defaultTo(0);
    table.uuid('contract_id').notNullable();
    table.timestamps(true, true);

    table.foreign('contract_id').references('id').inTable('contracts').onDelete('CASCADE');
    table.check('completion_value >= 0 AND completion_value <= 10');
  });

  await knex.schema.createTable('task_assignments', table => {
    table.uuid('id').primary();
    table.uuid('task_id').notNullable();
    table.uuid('employee_id').notNullable();
    table.timestamps(true, true);

    table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.foreign('employee_id').references('id').inTable('employees').onDelete('CASCADE');

    table.unique(['task_id', 'employee_id']);
  });

  await knex.schema.createTable('task_tags', table => {
    table.uuid('id').primary();
    table.uuid('task_id').notNullable();
    table.uuid('tag_id').notNullable();
    table.timestamps(true, true);
    table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');
    table.unique(['task_id', 'tag_id']);
  });

  await knex.raw(`
    CREATE TRIGGER employees_code_trigger 
    AFTER INSERT ON employees 
    WHEN NEW.code IS NULL
    BEGIN
      UPDATE code_counters 
      SET current_value = current_value + 1 
      WHERE entity_type = 'employees';
      
      UPDATE employees 
      SET code = 'E' || SUBSTR('000' || (SELECT current_value FROM code_counters WHERE entity_type = 'employees'), -3)
      WHERE id = NEW.id;
    END;
  `);

  await knex.raw(`
    CREATE TRIGGER programs_code_trigger 
    AFTER INSERT ON programs 
    WHEN NEW.code IS NULL
    BEGIN
      UPDATE code_counters 
      SET current_value = current_value + 1 
      WHERE entity_type = 'programs';
      
      UPDATE programs 
      SET code = 'P' || SUBSTR('000' || (SELECT current_value FROM code_counters WHERE entity_type = 'programs'), -3)
      WHERE id = NEW.id;
    END;
  `);

  await knex.raw(`
    CREATE TRIGGER contracts_code_trigger 
    AFTER INSERT ON contracts 
    WHEN NEW.code IS NULL
    BEGIN
      UPDATE code_counters 
      SET current_value = current_value + 1 
      WHERE entity_type = 'contracts';
      
      UPDATE contracts 
      SET code = 'C' || SUBSTR('000' || (SELECT current_value FROM code_counters WHERE entity_type = 'contracts'), -3)
      WHERE id = NEW.id;
    END;
  `);

  await knex.raw(`
    CREATE TRIGGER tags_code_trigger 
    AFTER INSERT ON tags 
    WHEN NEW.code IS NULL
    BEGIN
      UPDATE code_counters 
      SET current_value = current_value + 1 
      WHERE entity_type = 'tags';
      
      UPDATE tags 
      SET code = 'TAG' || SUBSTR('000' || (SELECT current_value FROM code_counters WHERE entity_type = 'tags'), -3)
      WHERE id = NEW.id;
    END;
  `);

  await knex.raw(`
    CREATE TRIGGER tasks_code_trigger 
    AFTER INSERT ON tasks 
    WHEN NEW.code IS NULL
    BEGIN
      UPDATE code_counters 
      SET current_value = current_value + 1 
      WHERE entity_type = 'tasks';
      
      UPDATE tasks 
      SET code = 'T' || SUBSTR('000' || (SELECT current_value FROM code_counters WHERE entity_type = 'tasks'), -3)
      WHERE id = NEW.id;
    END;
  `);
}
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('task_tags');
  await knex.schema.dropTableIfExists('task_assignments');
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('contracts');
  await knex.schema.dropTableIfExists('programs');
  await knex.schema.dropTableIfExists('employees');
  await knex.schema.dropTableIfExists('code_counters');
}
