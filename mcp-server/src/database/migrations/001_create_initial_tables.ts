import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create code_counters table for friendly code generation
  await knex.schema.createTable('code_counters', table => {
    table.string('entity_type').primary();
    table.integer('current_value').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  // Initialize counters for each entity type
  await knex('code_counters').insert([
    { entity_type: 'employees', current_value: 5 }, // E001-E005 used in seed
    { entity_type: 'programs', current_value: 2 }, // P001-P002 used in seed
    { entity_type: 'contracts', current_value: 3 }, // C001-C003 used in seed
    { entity_type: 'tags', current_value: 8 }, // TAG001-TAG008 used in seed
    { entity_type: 'tasks', current_value: 7 }, // T001-T007 used in seed
  ]);

  // Create employees table first (referenced by programs)
  await knex.schema.createTable('employees', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.string('job_title').notNullable();
    table.string('email').notNullable();
    table.timestamps(true, true); // created_at, updated_at with defaults
  });

  // Create programs table
  await knex.schema.createTable('programs', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
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
    table.string('code', 10).notNullable().unique();
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
    table.string('code', 10).notNullable().unique();
    table.string('name').notNullable();
    table.timestamps(true, true);

    // Unique constraint on tag names
    table.unique(['name']);
  });

  // Create tasks table
  await knex.schema.createTable('tasks', table => {
    table.uuid('id').primary();
    table.string('code', 10).notNullable().unique();
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

  // Create triggers for automatic code generation (only for new records after seeding)
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
  // Drop tables in reverse order of creation (handle foreign key dependencies)
  await knex.schema.dropTableIfExists('task_tags');
  await knex.schema.dropTableIfExists('task_assignments');
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('contracts');
  await knex.schema.dropTableIfExists('programs');
  await knex.schema.dropTableIfExists('employees');
  await knex.schema.dropTableIfExists('code_counters');
}
