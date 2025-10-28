import { db } from '../database/connection.js';
import { randomUUID } from 'crypto';
import type { Employee, CreateEmployee } from '../types/database.js';

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

    // We need to import taskService to get the task, but to avoid circular imports,
    // we'll directly query the task here
    const task = await db('tasks').where({ code: taskCode }).first();
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
    const task = await db('tasks').where({ code: taskCode }).first();
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

    const task = await db('tasks').where({ code: taskCode }).first();
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
