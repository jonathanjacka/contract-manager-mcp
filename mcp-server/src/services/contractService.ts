import { db } from '../database/connection.js';
import type { Contract, CreateContract, ContractWithProgram } from '../types/database.js';

export const contractService = {
  async getAll(): Promise<Contract[]> {
    return db('contracts').select('*').orderBy('name');
  },

  async getAllWithPrograms(): Promise<ContractWithProgram[]> {
    return db('contracts')
      .join('programs', 'contracts.program_id', 'programs.id')
      .select(
        'contracts.*',
        'programs.code as program_code',
        'programs.name as program_name',
        'programs.description as program_description',
        'programs.manager_id as program_manager_id',
        'programs.created_at as program_created_at',
        'programs.updated_at as program_updated_at'
      )
      .orderBy('contracts.name')
      .then(rows =>
        rows.map(row => ({
          id: row.id,
          code: row.code,
          name: row.name,
          description: row.description,
          program_id: row.program_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          program: {
            id: row.program_id,
            code: row.program_code,
            name: row.program_name,
            description: row.program_description,
            manager_id: row.program_manager_id,
            created_at: row.program_created_at,
            updated_at: row.program_updated_at,
          },
        }))
      );
  },

  async getById(id: string): Promise<Contract | undefined> {
    return db('contracts').where({ id }).first();
  },

  async getByCode(code: string): Promise<Contract | undefined> {
    return db('contracts').where({ code }).first();
  },

  async getByProgramId(programId: string): Promise<Contract[]> {
    return db('contracts').where({ program_id: programId }).orderBy('name');
  },

  async create(data: CreateContract): Promise<Contract> {
    const [contract] = await db('contracts').insert(data).returning('*');
    return contract;
  },

  async update(id: string, data: Partial<CreateContract>): Promise<Contract | undefined> {
    const [contract] = await db('contracts')
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return contract;
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await db('contracts').where({ id }).del();
    return deletedCount > 0;
  },
};
