import { db } from '../database/connection.js';
import { randomUUID } from 'crypto';
import type {
  Task,
  CreateTask,
  TaskWithDetails,
  Employee,
  Tag,
  TaskAssignment,
  TaskTag,
} from '../types/database.js';

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
        'contracts.code as contract_code',
        'contracts.name as contract_name',
        'contracts.description as contract_description',
        'contracts.created_at as contract_created_at',
        'contracts.updated_at as contract_updated_at',
        'programs.id as program_id',
        'programs.code as program_code',
        'programs.name as program_name',
        'programs.description as program_description',
        'programs.manager_id as program_manager_id',
        'programs.created_at as program_created_at',
        'programs.updated_at as program_updated_at'
      )
      .orderBy('tasks.name');

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
        code: task.code,
        name: task.name,
        completion_value: task.completion_value,
        contract_id: task.contract_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        contract: {
          id: task.contract_id,
          code: task.contract_code,
          name: task.contract_name,
          description: task.contract_description,
          program_id: task.program_id,
          created_at: task.contract_created_at,
          updated_at: task.contract_updated_at,
          program: {
            id: task.program_id,
            code: task.program_code,
            name: task.program_name,
            description: task.program_description,
            manager_id: task.program_manager_id,
            created_at: task.program_created_at,
            updated_at: task.program_updated_at,
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

  async getByCode(code: string): Promise<Task | undefined> {
    return db('tasks').where({ code }).first();
  },

  async getByContractCode(contractCode: string): Promise<Task[]> {
    const contract = await db('contracts').where({ code: contractCode }).first();
    if (!contract) return [];
    return db('tasks').where({ contract_id: contract.id }).orderBy('name');
  },

  async createWithCode(data: {
    name: string;
    completion_value: number;
    contract_code: string;
  }): Promise<Task> {
    const contract = await db('contracts').where({ code: data.contract_code }).first();
    if (!contract) throw new Error(`Contract with code ${data.contract_code} not found`);

    // Generate the next task code manually
    await db('code_counters').where({ entity_type: 'tasks' }).increment('current_value', 1);

    const counter = await db('code_counters')
      .where({ entity_type: 'tasks' })
      .select('current_value')
      .first();

    const taskCode = `T${String(counter.current_value).padStart(3, '0')}`;

    const [task] = await db('tasks')
      .insert({
        id: randomUUID(),
        code: taskCode,
        name: data.name,
        completion_value: data.completion_value,
        contract_id: contract.id,
      })
      .returning('*');
    return task;
  },

  async updateByCode(
    code: string,
    data: { name?: string | undefined; completion_value?: number | undefined }
  ): Promise<Task> {
    const task = await this.getByCode(code);
    if (!task) throw new Error(`Task with code ${code} not found`);

    // Filter out undefined values
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.completion_value !== undefined) updateData.completion_value = data.completion_value;
    updateData.updated_at = new Date();

    const [updatedTask] = await db('tasks').where({ code }).update(updateData).returning('*');
    return updatedTask;
  },

  async deleteByCode(code: string): Promise<void> {
    const task = await this.getByCode(code);
    if (!task) throw new Error(`Task with code ${code} not found`);

    // Delete task-tag relationships first
    await db('task_tags').where({ task_id: task.id }).del();
    // Delete task assignments
    await db('task_assignments').where({ task_id: task.id }).del();
    // Delete the task
    await db('tasks').where({ code }).del();
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
