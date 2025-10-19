/**
 * Database service layer providing simple CRUD operations for all entities
 */

import { db } from '../database/connection.js';
import type {
  Program,
  Contract,
  Task,
  Employee,
  Tag,
  TaskAssignment,
  TaskTag,
  CreateProgram,
  CreateContract,
  CreateTask,
  CreateEmployee,
  CreateTag,
  ProgramWithManager,
  ContractWithProgram,
  TaskWithDetails,
} from '../types/database.js';

// ============================================================================
// EMPLOYEE SERVICES
// ============================================================================

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return db('employees').select('*').orderBy('name');
  },

  async getById(id: string): Promise<Employee | undefined> {
    return db('employees').where({ id }).first();
  },

  async create(data: CreateEmployee): Promise<Employee> {
    const [employee] = await db('employees').insert(data).returning('*');
    return employee;
  },

  async update(id: string, data: Partial<CreateEmployee>): Promise<Employee | undefined> {
    const [employee] = await db('employees')
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return employee;
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await db('employees').where({ id }).del();
    return deletedCount > 0;
  },
};

// ============================================================================
// PROGRAM SERVICES
// ============================================================================

export const programService = {
  async getAll(): Promise<Program[]> {
    return db('programs').select('*').orderBy('name');
  },

  async getAllWithManagers(): Promise<ProgramWithManager[]> {
    return db('programs')
      .join('employees', 'programs.manager_id', 'employees.id')
      .select(
        'programs.*',
        'employees.name as manager_name',
        'employees.job_title as manager_job_title',
        'employees.email as manager_email'
      )
      .orderBy('programs.name')
      .then(rows =>
        rows.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          manager_id: row.manager_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          manager: {
            id: row.manager_id,
            name: row.manager_name,
            job_title: row.manager_job_title,
            email: row.manager_email,
            created_at: row.created_at,
            updated_at: row.updated_at,
          },
        }))
      );
  },

  async getById(id: string): Promise<Program | undefined> {
    return db('programs').where({ id }).first();
  },

  async getByIdWithManager(id: string): Promise<ProgramWithManager | undefined> {
    const row = await db('programs')
      .join('employees', 'programs.manager_id', 'employees.id')
      .select(
        'programs.*',
        'employees.name as manager_name',
        'employees.job_title as manager_job_title',
        'employees.email as manager_email'
      )
      .where('programs.id', id)
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      manager_id: row.manager_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      manager: {
        id: row.manager_id,
        name: row.manager_name,
        job_title: row.manager_job_title,
        email: row.manager_email,
        created_at: row.created_at,
        updated_at: row.updated_at,
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

// ============================================================================
// CONTRACT SERVICES
// ============================================================================

export const contractService = {
  async getAll(): Promise<Contract[]> {
    return db('contracts').select('*').orderBy('name');
  },

  async getAllWithPrograms(): Promise<ContractWithProgram[]> {
    return db('contracts')
      .join('programs', 'contracts.program_id', 'programs.id')
      .select(
        'contracts.*',
        'programs.name as program_name',
        'programs.description as program_description',
        'programs.manager_id as program_manager_id'
      )
      .orderBy('contracts.name')
      .then(rows =>
        rows.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          program_id: row.program_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          program: {
            id: row.program_id,
            name: row.program_name,
            description: row.program_description,
            manager_id: row.program_manager_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
          },
        }))
      );
  },

  async getById(id: string): Promise<Contract | undefined> {
    return db('contracts').where({ id }).first();
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

// ============================================================================
// TAG SERVICES
// ============================================================================

export const tagService = {
  async getAll(): Promise<Tag[]> {
    return db('tags').select('*').orderBy('name');
  },

  async getById(id: string): Promise<Tag | undefined> {
    return db('tags').where({ id }).first();
  },

  async getByName(name: string): Promise<Tag | undefined> {
    return db('tags').where({ name }).first();
  },

  async create(data: CreateTag): Promise<Tag> {
    const [tag] = await db('tags').insert(data).returning('*');
    return tag;
  },

  async update(id: string, data: Partial<CreateTag>): Promise<Tag | undefined> {
    const [tag] = await db('tags')
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return tag;
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await db('tags').where({ id }).del();
    return deletedCount > 0;
  },
};

// ============================================================================
// TASK SERVICES
// ============================================================================

export const taskService = {
  async getAll(): Promise<Task[]> {
    return db('tasks').select('*').orderBy('name');
  },

  async getAllWithDetails(): Promise<TaskWithDetails[]> {
    const tasks = await db('tasks')
      .join('contracts', 'tasks.contract_id', 'contracts.id')
      .join('programs', 'contracts.program_id', 'programs.id')
      .select(
        'tasks.*',
        'contracts.name as contract_name',
        'contracts.description as contract_description',
        'programs.id as program_id',
        'programs.name as program_name',
        'programs.description as program_description',
        'programs.manager_id as program_manager_id'
      )
      .orderBy('tasks.name');

    // Get employees and tags for each task
    const tasksWithDetails: TaskWithDetails[] = [];
    for (const task of tasks) {
      const employees = await db('task_assignments')
        .join('employees', 'task_assignments.employee_id', 'employees.id')
        .where('task_assignments.task_id', task.id)
        .select('employees.*');

      const tags = await db('task_tags')
        .join('tags', 'task_tags.tag_id', 'tags.id')
        .where('task_tags.task_id', task.id)
        .select('tags.*');

      tasksWithDetails.push({
        id: task.id,
        name: task.name,
        completion_value: task.completion_value,
        contract_id: task.contract_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        contract: {
          id: task.contract_id,
          name: task.contract_name,
          description: task.contract_description,
          program_id: task.program_id,
          created_at: task.created_at,
          updated_at: task.updated_at,
          program: {
            id: task.program_id,
            name: task.program_name,
            description: task.program_description,
            manager_id: task.program_manager_id,
            created_at: task.created_at,
            updated_at: task.updated_at,
          },
        },
        employees,
        tags,
      });
    }
    return tasksWithDetails;
  },

  async getById(id: string): Promise<Task | undefined> {
    return db('tasks').where({ id }).first();
  },

  async getByContractId(contractId: string): Promise<Task[]> {
    return db('tasks').where({ contract_id: contractId }).orderBy('name');
  },

  async getCompleted(): Promise<Task[]> {
    return db('tasks').where({ completion_value: 10 }).orderBy('name');
  },

  async getIncomplete(): Promise<Task[]> {
    return db('tasks').where('completion_value', '<', 10).orderBy('name');
  },

  async create(data: CreateTask): Promise<Task> {
    const [task] = await db('tasks').insert(data).returning('*');
    return task;
  },

  async update(id: string, data: Partial<CreateTask>): Promise<Task | undefined> {
    const [task] = await db('tasks')
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return task;
  },

  async updateCompletion(id: string, completionValue: number): Promise<Task | undefined> {
    if (completionValue < 0 || completionValue > 10) {
      throw new Error('Completion value must be between 0 and 10');
    }
    return this.update(id, { completion_value: completionValue });
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await db('tasks').where({ id }).del();
    return deletedCount > 0;
  },

  // Task assignment methods
  async assignEmployee(taskId: string, employeeId: string): Promise<TaskAssignment> {
    const [assignment] = await db('task_assignments')
      .insert({ task_id: taskId, employee_id: employeeId })
      .returning('*');
    return assignment;
  },

  async unassignEmployee(taskId: string, employeeId: string): Promise<boolean> {
    const deletedCount = await db('task_assignments')
      .where({ task_id: taskId, employee_id: employeeId })
      .del();
    return deletedCount > 0;
  },

  async getAssignedEmployees(taskId: string): Promise<Employee[]> {
    return db('task_assignments')
      .join('employees', 'task_assignments.employee_id', 'employees.id')
      .where('task_assignments.task_id', taskId)
      .select('employees.*');
  },

  // Task tag methods
  async addTag(taskId: string, tagId: string): Promise<TaskTag> {
    const [taskTag] = await db('task_tags')
      .insert({ task_id: taskId, tag_id: tagId })
      .returning('*');
    return taskTag;
  },

  async removeTag(taskId: string, tagId: string): Promise<boolean> {
    const deletedCount = await db('task_tags').where({ task_id: taskId, tag_id: tagId }).del();
    return deletedCount > 0;
  },

  async getTags(taskId: string): Promise<Tag[]> {
    return db('task_tags')
      .join('tags', 'task_tags.tag_id', 'tags.id')
      .where('task_tags.task_id', taskId)
      .select('tags.*');
  },
};
