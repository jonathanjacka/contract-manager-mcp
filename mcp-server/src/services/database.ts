import { db } from '../database/connection.js';
import { randomUUID } from 'crypto';
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

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return db('employees').select('*').orderBy('name');
  },

  async getById(id: string): Promise<Employee | undefined> {
    return db('employees').where({ id }).first();
  },

  async getByCode(code: string): Promise<Employee | undefined> {
    return db('employees').where({ code }).first();
  },

  async createWithCode(data: {
    name: string;
    job_title: string;
    email: string;
  }): Promise<Employee> {
    // Generate the next employee code manually
    await db('code_counters').where({ entity_type: 'employees' }).increment('current_value', 1);

    const counter = await db('code_counters')
      .where({ entity_type: 'employees' })
      .select('current_value')
      .first();

    const employeeCode = `E${String(counter.current_value).padStart(3, '0')}`;

    const [employee] = await db('employees')
      .insert({
        id: randomUUID(),
        code: employeeCode,
        name: data.name,
        job_title: data.job_title,
        email: data.email,
      })
      .returning('*');
    return employee;
  },

  async addToTask(employeeCode: string, taskCode: string): Promise<void> {
    const employee = await this.getByCode(employeeCode);
    if (!employee) throw new Error(`Employee with code ${employeeCode} not found`);

    const task = await taskService.getByCode(taskCode);
    if (!task) throw new Error(`Task with code ${taskCode} not found`);

    // Check if assignment already exists
    const existing = await db('task_assignments')
      .where({ employee_id: employee.id, task_id: task.id })
      .first();

    if (existing) {
      throw new Error(`Employee ${employeeCode} is already assigned to task ${taskCode}`);
    }

    await db('task_assignments').insert({
      id: randomUUID(),
      employee_id: employee.id,
      task_id: task.id,
    });
  },

  async getByTaskCode(taskCode: string): Promise<Employee[]> {
    const task = await taskService.getByCode(taskCode);
    if (!task) return [];

    return db('employees')
      .join('task_assignments', 'employees.id', 'task_assignments.employee_id')
      .where('task_assignments.task_id', task.id)
      .select('employees.*')
      .orderBy('employees.name');
  },

  async updateByCode(
    code: string,
    data: { name?: string | undefined; job_title?: string | undefined; email?: string | undefined }
  ): Promise<Employee> {
    const employee = await this.getByCode(code);
    if (!employee) throw new Error(`Employee with code ${code} not found`);

    // Filter out undefined values
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.job_title !== undefined) updateData.job_title = data.job_title;
    if (data.email !== undefined) updateData.email = data.email;
    updateData.updated_at = new Date();

    const [updatedEmployee] = await db('employees')
      .where({ code })
      .update(updateData)
      .returning('*');
    return updatedEmployee;
  },

  async deleteByCode(code: string): Promise<void> {
    const employee = await this.getByCode(code);
    if (!employee) throw new Error(`Employee with code ${code} not found`);

    // Delete task assignments first
    await db('task_assignments').where({ employee_id: employee.id }).del();
    // Delete the employee
    await db('employees').where({ code }).del();
  },

  async removeFromTask(employeeCode: string, taskCode: string): Promise<void> {
    const employee = await this.getByCode(employeeCode);
    if (!employee) throw new Error(`Employee with code ${employeeCode} not found`);

    const task = await taskService.getByCode(taskCode);
    if (!task) throw new Error(`Task with code ${taskCode} not found`);

    // Check if assignment exists
    const existing = await db('task_assignments')
      .where({ employee_id: employee.id, task_id: task.id })
      .first();

    if (!existing) {
      throw new Error(`Employee ${employeeCode} is not assigned to task ${taskCode}`);
    }

    await db('task_assignments').where({ employee_id: employee.id, task_id: task.id }).del();
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

export const tagService = {
  async getAll(): Promise<Tag[]> {
    return db('tags').select('*').orderBy('name');
  },

  async getById(id: string): Promise<Tag | undefined> {
    return db('tags').where({ id }).first();
  },

  async getByCode(code: string): Promise<Tag | undefined> {
    return db('tags').where({ code }).first();
  },

  async getByName(name: string): Promise<Tag | undefined> {
    return db('tags').where({ name }).first();
  },

  async createWithCode(data: { name: string }): Promise<Tag> {
    // Check if tag name already exists
    const existing = await this.getByName(data.name);
    if (existing) {
      throw new Error(`Tag with name "${data.name}" already exists`);
    }

    // Generate the next tag code manually
    await db('code_counters').where({ entity_type: 'tags' }).increment('current_value', 1);

    const counter = await db('code_counters')
      .where({ entity_type: 'tags' })
      .select('current_value')
      .first();

    const tagCode = `TAG${String(counter.current_value).padStart(3, '0')}`;

    const [tag] = await db('tags')
      .insert({
        id: randomUUID(),
        code: tagCode,
        name: data.name,
      })
      .returning('*');
    return tag;
  },

  async updateByCode(code: string, data: { name?: string | undefined }): Promise<Tag> {
    const tag = await this.getByCode(code);
    if (!tag) throw new Error(`Tag with code ${code} not found`);

    // Check if new name already exists (and it's different from current name)
    if (data.name !== undefined && data.name !== tag.name) {
      const existing = await this.getByName(data.name);
      if (existing) {
        throw new Error(`Tag with name "${data.name}" already exists`);
      }
    }

    // Filter out undefined values
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    updateData.updated_at = new Date();

    const [updatedTag] = await db('tags').where({ code }).update(updateData).returning('*');
    return updatedTag;
  },

  async deleteByCode(code: string): Promise<void> {
    const tag = await this.getByCode(code);
    if (!tag) throw new Error(`Tag with code ${code} not found`);

    // Delete task-tag relationships first
    await db('task_tags').where({ tag_id: tag.id }).del();
    // Delete the tag
    await db('tags').where({ code }).del();
  },

  async addToTask(tagCode: string, taskCode: string): Promise<void> {
    const tag = await this.getByCode(tagCode);
    if (!tag) throw new Error(`Tag with code ${tagCode} not found`);

    const task = await taskService.getByCode(taskCode);
    if (!task) throw new Error(`Task with code ${taskCode} not found`);

    // Check if relationship already exists
    const existing = await db('task_tags').where({ tag_id: tag.id, task_id: task.id }).first();

    if (existing) {
      throw new Error(`Tag ${tagCode} is already applied to task ${taskCode}`);
    }

    await db('task_tags').insert({
      id: randomUUID(),
      tag_id: tag.id,
      task_id: task.id,
    });
  },

  async removeFromTask(tagCode: string, taskCode: string): Promise<void> {
    const tag = await this.getByCode(tagCode);
    if (!tag) throw new Error(`Tag with code ${tagCode} not found`);

    const task = await taskService.getByCode(taskCode);
    if (!task) throw new Error(`Task with code ${taskCode} not found`);

    // Check if relationship exists
    const existing = await db('task_tags').where({ tag_id: tag.id, task_id: task.id }).first();

    if (!existing) {
      throw new Error(`Tag ${tagCode} is not applied to task ${taskCode}`);
    }

    await db('task_tags').where({ tag_id: tag.id, task_id: task.id }).del();
  },

  async getByTaskCode(taskCode: string): Promise<Tag[]> {
    const task = await taskService.getByCode(taskCode);
    if (!task) return [];

    return db('tags')
      .join('task_tags', 'tags.id', 'task_tags.tag_id')
      .where('task_tags.task_id', task.id)
      .select('tags.*')
      .orderBy('tags.name');
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
    const contract = await contractService.getByCode(contractCode);
    if (!contract) return [];
    return db('tasks').where({ contract_id: contract.id }).orderBy('name');
  },

  async createWithCode(data: {
    name: string;
    completion_value: number;
    contract_code: string;
  }): Promise<Task> {
    const contract = await contractService.getByCode(data.contract_code);
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
