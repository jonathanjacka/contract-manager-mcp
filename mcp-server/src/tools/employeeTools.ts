import type { ContractManagerMCP } from '../index.js';
import { employeeService, taskService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import {
  employeeCodeSchema,
  taskCodeSchema,
  createEmployeeInputSchema,
  updateEmployeeInputSchema,
  employeeTaskSchema,
} from '../schemas/schema.js';
import {
  createText,
  createEmployeeResourceLink,
  createEmployeeEmbeddedResource,
  createTaskEmbeddedResource,
} from './utils.js';

export function registerEmployeeTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'list_employees',
    {
      title: 'List Employees',
      description: 'List all employees in the contract management system',
    },
    async () => {
      const employees = await employeeService.getAll();
      const employeeLinks = employees.map(createEmployeeResourceLink);
      return {
        content: [createText(`Found ${employees.length} employees.`), ...employeeLinks],
      };
    }
  );

  agent.server.registerTool(
    'get_employee',
    {
      title: 'Get Employee',
      description: 'Get an employee by their code',
      inputSchema: employeeCodeSchema,
    },
    async ({ code }) => {
      const employee = await employeeService.getByCode(code);
      assert(employee, `Employee with code "${code}" not found`);
      return {
        content: [createEmployeeEmbeddedResource(employee)],
      };
    }
  );

  agent.server.registerTool(
    'add_employee',
    {
      title: 'Add Employee',
      description: 'Create a new employee',
      inputSchema: createEmployeeInputSchema,
    },
    async employeeData => {
      const createdEmployee = await employeeService.createWithCode(employeeData);
      return {
        content: [
          createText(
            `Employee "${createdEmployee.name}" created successfully with code "${createdEmployee.code}"`
          ),
          createEmployeeEmbeddedResource(createdEmployee),
        ],
      };
    }
  );

  agent.server.registerTool(
    'add_employee_to_task',
    {
      title: 'Add Employee to Task',
      description: 'Assign an employee to a task',
      inputSchema: employeeTaskSchema,
    },
    async ({ employee_code, task_code }) => {
      const employee = await employeeService.getByCode(employee_code);
      const task = await taskService.getByCode(task_code);
      assert(employee, `Employee with code "${employee_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await employeeService.addToTask(employee_code, task_code);

      return {
        content: [
          createText(
            `Employee "${employee.name}" (${employee_code}) assigned to task "${task.name}" (${task_code}) successfully`
          ),
          createEmployeeEmbeddedResource(employee),
          createTaskEmbeddedResource(task),
        ],
      };
    }
  );

  agent.server.registerTool(
    'get_employee_by_task',
    {
      title: 'Get Employees by Task',
      description: 'Get all employees assigned to a specific task',
      inputSchema: taskCodeSchema,
    },
    async ({ code }) => {
      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      const employees = await employeeService.getByTaskCode(code);
      const employeeLinks = employees.map(createEmployeeResourceLink);
      return {
        content: [
          createText(
            `Found ${employees.length} employees assigned to task "${task.name}" (${code}).`
          ),
          ...employeeLinks,
        ],
      };
    }
  );

  agent.server.registerTool(
    'edit_employee',
    {
      title: 'Edit Employee',
      description: 'Update an employee. Fields that are not provided will not be updated.',
      inputSchema: updateEmployeeInputSchema,
    },
    async ({ code, ...updates }) => {
      const existingEmployee = await employeeService.getByCode(code);
      assert(existingEmployee, `Employee with code "${code}" not found`);
      const updatedEmployee = await employeeService.updateByCode(code, updates);
      return {
        content: [
          createText(`Employee "${updatedEmployee.name}" (code: ${code}) updated successfully`),
          createEmployeeEmbeddedResource(updatedEmployee),
        ],
      };
    }
  );

  agent.server.registerTool(
    'delete_employee',
    {
      title: 'Delete Employee',
      description: 'Delete an employee',
      inputSchema: employeeCodeSchema,
    },
    async ({ code }) => {
      const existingEmployee = await employeeService.getByCode(code);
      assert(existingEmployee, `Employee with code "${code}" not found`);
      await employeeService.deleteByCode(code);
      return {
        content: [
          createText(`Employee "${existingEmployee.name}" (code: ${code}) deleted successfully`),
          createEmployeeEmbeddedResource(existingEmployee),
        ],
      };
    }
  );

  agent.server.registerTool(
    'remove_employee_from_task',
    {
      title: 'Remove Employee from Task',
      description: 'Remove an employee assignment from a task',
      inputSchema: employeeTaskSchema,
    },
    async ({ employee_code, task_code }) => {
      const employee = await employeeService.getByCode(employee_code);
      const task = await taskService.getByCode(task_code);
      assert(employee, `Employee with code "${employee_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await employeeService.removeFromTask(employee_code, task_code);

      return {
        content: [
          createText(
            `Employee "${employee.name}" (${employee_code}) removed from task "${task.name}" (${task_code}) successfully`
          ),
          createEmployeeEmbeddedResource(employee),
          createTaskEmbeddedResource(task),
        ],
      };
    }
  );
}
