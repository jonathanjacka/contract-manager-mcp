import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { employeeService, taskService } from '../services/index.js';
import { db } from '../database/connection.js';
import { assert } from '../utils/assert.js';
import { z } from 'zod';
import {
  employeeCodeSchema,
  taskCodeSchema,
  createEmployeeInputSchema,
  updateEmployeeInputSchema,
  employeeTaskSchema,
  employeeListOutputSchema,
  employeeOutputSchema,
  taskOutputSchema,
} from '../schemas/schema.js';
import {
  createText,
  createEmployeeResourceLink,
  createEmployeeEmbeddedResource,
  createTaskEmbeddedResource,
} from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export async function registerEmployeeTools(agent: ContractManagerMCP) {
  const initialEmployees = await employeeService.getAll();
  let hasEmployees = initialEmployees.length > 0;

  async function updateEmployeeToolsAvailability() {
    const employees = await employeeService.getAll();
    const newHasEmployees = employees.length > 0;

    // Only update if state has changed
    if (newHasEmployees === hasEmployees) {
      return;
    }

    hasEmployees = newHasEmployees;

    if (hasEmployees) {
      listEmployeesTool.enable();
      getEmployeeTool.enable();
      addEmployeeToTaskTool.enable();
      getEmployeeByTaskTool.enable();
      editEmployeeTool.enable();
      deleteEmployeeTool.enable();
      removeEmployeeFromTaskTool.enable();
    } else {
      listEmployeesTool.disable();
      getEmployeeTool.disable();
      addEmployeeToTaskTool.disable();
      getEmployeeByTaskTool.disable();
      editEmployeeTool.disable();
      deleteEmployeeTool.disable();
      removeEmployeeFromTaskTool.disable();
    }
    // addEmployeeTool always enabled
  }

  const listEmployeesTool = agent.server.registerTool(
    'list_employees',
    {
      title: 'List Employees',
      description: 'List all employees in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      outputSchema: employeeListOutputSchema,
    },
    async () => {
      const employees = await employeeService.getAll();
      const employeeLinks = employees.map(createEmployeeResourceLink);
      const structuredContent = {
        employees,
        count: employees.length,
      };
      return {
        content: [
          createText(`Found ${employees.length} employees.`),
          ...employeeLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const getEmployeeTool = agent.server.registerTool(
    'get_employee',
    {
      title: 'Get Employee',
      description: 'Get an employee by their code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: employeeCodeSchema,
      outputSchema: { employee: z.object(employeeOutputSchema) },
    },
    async ({ code }) => {
      const employee = await employeeService.getByCode(code);
      assert(employee, `Employee with code "${code}" not found`);
      const structuredContent = { employee };
      return {
        content: [createEmployeeEmbeddedResource(employee), createText(structuredContent)],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'add_employee',
    {
      title: 'Add Employee',
      description: 'Create a new employee',
      annotations: {
        destructiveHint: false,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: createEmployeeInputSchema,
      outputSchema: { employee: z.object(employeeOutputSchema) },
    },
    async employeeData => {
      const createdEmployee = await employeeService.createWithCode(employeeData);
      await updateEmployeeToolsAvailability();
      const structuredContent = { employee: createdEmployee };
      return {
        content: [
          createText(
            `Employee "${createdEmployee.name}" created successfully with code "${createdEmployee.code}"`
          ),
          createEmployeeEmbeddedResource(createdEmployee),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const addEmployeeToTaskTool = agent.server.registerTool(
    'add_employee_to_task',
    {
      title: 'Add Employee to Task',
      description: 'Assign an employee to a task',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: employeeTaskSchema,
      outputSchema: {
        employee: z.object(employeeOutputSchema),
        task: z.object(taskOutputSchema),
      },
    },
    async ({ employee_code, task_code }) => {
      const employee = await employeeService.getByCode(employee_code);
      const task = await taskService.getByCode(task_code);
      assert(employee, `Employee with code "${employee_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await employeeService.addToTask(employee_code, task_code);

      const structuredContent = { employee, task };
      return {
        content: [
          createText(
            `Employee "${employee.name}" (${employee_code}) assigned to task "${task.name}" (${task_code}) successfully`
          ),
          createEmployeeEmbeddedResource(employee),
          createTaskEmbeddedResource(task),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const getEmployeeByTaskTool = agent.server.registerTool(
    'get_employee_by_task',
    {
      title: 'Get Employees by Task',
      description: 'Get all employees assigned to a specific task',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: taskCodeSchema,
      outputSchema: {
        task_code: z.string(),
        task_name: z.string(),
        ...employeeListOutputSchema,
      },
    },
    async ({ code }) => {
      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      const employees = await employeeService.getByTaskCode(code);
      const employeeLinks = employees.map(createEmployeeResourceLink);
      const structuredContent = {
        task_code: code,
        task_name: task.name,
        employees,
        count: employees.length,
      };
      return {
        content: [
          createText(
            `Found ${employees.length} employees assigned to task "${task.name}" (${code}).`
          ),
          ...employeeLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const editEmployeeTool = agent.server.registerTool(
    'edit_employee',
    {
      title: 'Edit Employee',
      description: 'Update an employee. Fields that are not provided will not be updated.',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: updateEmployeeInputSchema,
      outputSchema: { employee: z.object(employeeOutputSchema) },
    },
    async ({ code, ...updates }) => {
      const existingEmployee = await employeeService.getByCode(code);
      assert(existingEmployee, `Employee with code "${code}" not found`);
      const updatedEmployee = await employeeService.updateByCode(code, updates);
      const structuredContent = { employee: updatedEmployee };
      return {
        content: [
          createText(`Employee "${updatedEmployee.name}" (code: ${code}) updated successfully`),
          createEmployeeEmbeddedResource(updatedEmployee),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const deleteEmployeeTool = agent.server.registerTool(
    'delete_employee',
    {
      title: 'Delete Employee',
      description: 'Delete an employee',
      annotations: {
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: employeeCodeSchema,
      outputSchema: { employee: z.object(employeeOutputSchema) },
    },
    async ({ code }) => {
      const existingEmployee = await employeeService.getByCode(code);
      assert(existingEmployee, `Employee with code "${code}" not found`);

      // Check if employee is a program manager
      const programManaged = await db('programs').where('manager_id', existingEmployee.id).first();
      if (programManaged) {
        const structuredContent = { employee: existingEmployee };
        return {
          content: [
            createText(
              `Cannot delete employee "${existingEmployee.name}" (code: ${code}) because they are assigned as a program manager. Please reassign or remove the program(s) first.`
            ),
            createEmployeeEmbeddedResource(existingEmployee),
            createText(JSON.stringify(structuredContent, null, 2)),
          ],
          structuredContent,
        };
      }

      // Elicitation: ask for confirmation before deleting
      const capabilities = agent.server.server.getClientCapabilities?.();
      if (capabilities?.elicitation) {
        const result = await agent.server.server.elicitInput({
          message: `Are you sure you want to delete employee "${existingEmployee.name}" (code: ${code})?`,
          requestedSchema: {
            type: 'object',
            properties: {
              confirmed: {
                type: 'boolean',
                description: 'Whether to confirm the action',
              },
            },
          },
        });
        const confirmed = result.action === 'accept' && result.content?.['confirmed'] === true;
        if (!confirmed) {
          const structuredContent = { employee: existingEmployee };
          return {
            content: [
              createText(
                `Deleting employee "${existingEmployee.name}" (code: ${code}) was cancelled by the user.`
              ),
              createEmployeeEmbeddedResource(existingEmployee),
              createText(structuredContent),
              createText(JSON.stringify(structuredContent, null, 2)),
            ],
            structuredContent,
          };
        }
      }

      await employeeService.deleteByCode(code);
      await updateEmployeeToolsAvailability();
      const structuredContent = { employee: existingEmployee };
      return {
        content: [
          createText(`Employee "${existingEmployee.name}" (code: ${code}) deleted successfully`),
          createEmployeeEmbeddedResource(existingEmployee),
          createText(structuredContent),
          createText(JSON.stringify(structuredContent, null, 2)),
        ],
        structuredContent,
      };
    }
  );

  const removeEmployeeFromTaskTool = agent.server.registerTool(
    'remove_employee_from_task',
    {
      title: 'Remove Employee from Task',
      description: 'Remove an employee assignment from a task',
      annotations: {
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: employeeTaskSchema,
      outputSchema: {
        employee: z.object(employeeOutputSchema),
        task: z.object(taskOutputSchema),
      },
    },
    async ({ employee_code, task_code }) => {
      const employee = await employeeService.getByCode(employee_code);
      const task = await taskService.getByCode(task_code);
      assert(employee, `Employee with code "${employee_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await employeeService.removeFromTask(employee_code, task_code);

      const structuredContent = { employee, task };
      return {
        content: [
          createText(
            `Employee "${employee.name}" (${employee_code}) removed from task "${task.name}" (${task_code}) successfully`
          ),
          createEmployeeEmbeddedResource(employee),
          createTaskEmbeddedResource(task),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  // Set initial tool states
  if (!hasEmployees) {
    listEmployeesTool.disable();
    getEmployeeTool.disable();
    addEmployeeToTaskTool.disable();
    getEmployeeByTaskTool.disable();
    editEmployeeTool.disable();
    deleteEmployeeTool.disable();
    removeEmployeeFromTaskTool.disable();
  }
}
