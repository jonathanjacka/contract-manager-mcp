import { db } from '../database/connection.js';
import type { Program, CreateProgram, ProgramWithManager } from '../types/database.js';

export const programService = {
  async getAll(): Promise<Program[]> {
    return db('programs').select('*').orderBy('name');
  },

  async getAllWithManagers(): Promise<ProgramWithManager[]> {
    return db('programs')
      .join('employees', 'programs.manager_id', 'employees.id')
      .select(
        'programs.*',
        'employees.code as manager_code',
        'employees.name as manager_name',
        'employees.job_title as manager_job_title',
        'employees.email as manager_email',
        'employees.created_at as manager_created_at',
        'employees.updated_at as manager_updated_at'
      )
      .orderBy('programs.name')
      .then(rows =>
        rows.map(row => ({
          id: row.id,
          code: row.code,
          name: row.name,
          description: row.description,
          manager_id: row.manager_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          manager: {
            id: row.manager_id,
            code: row.manager_code,
            name: row.manager_name,
            job_title: row.manager_job_title,
            email: row.manager_email,
            created_at: row.manager_created_at,
            updated_at: row.manager_updated_at,
          },
        }))
      );
  },

  async getById(id: string): Promise<Program | undefined> {
    return db('programs').where({ id }).first();
  },

  async getByCode(code: string): Promise<Program | undefined> {
    return db('programs').where({ code }).first();
  },

  async getByIdWithManager(id: string): Promise<ProgramWithManager | undefined> {
    const row = await db('programs')
      .join('employees', 'programs.manager_id', 'employees.id')
      .select(
        'programs.*',
        'employees.code as manager_code',
        'employees.name as manager_name',
        'employees.job_title as manager_job_title',
        'employees.email as manager_email',
        'employees.created_at as manager_created_at',
        'employees.updated_at as manager_updated_at'
      )
      .where('programs.id', id)
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      manager_id: row.manager_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      manager: {
        id: row.manager_id,
        code: row.manager_code,
        name: row.manager_name,
        job_title: row.manager_job_title,
        email: row.manager_email,
        created_at: row.manager_created_at,
        updated_at: row.manager_updated_at,
      },
    };
  },

  async create(data: CreateProgram): Promise<Program> {
    const [program] = await db('programs').insert(data).returning('*');
    return program;
  },

  async update(id: string, data: Partial<CreateProgram>): Promise<Program | undefined> {
    const [program] = await db('programs')
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return program;
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await db('programs').where({ id }).del();
    return deletedCount > 0;
  },
};
