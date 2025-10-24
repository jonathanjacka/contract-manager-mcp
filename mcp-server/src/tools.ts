import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  employeeService,
  programService,
  contractService,
  taskService,
  tagService,
} from './services/database.js';
import type { Employee, Program, Contract, Task, Tag } from './types/database.js';
import type { ContractManagerMCP } from './index.js';
import { assert } from './utils/assert.js';
import {
  employeeCodeSchema,
  programCodeSchema,
  contractCodeSchema,
  taskCodeSchema,
  tagCodeSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  createEmployeeInputSchema,
  updateEmployeeInputSchema,
  employeeTaskSchema,
  createTagInputSchema,
  updateTagInputSchema,
  tagTaskSchema,
} from './schemas/schema.js';

export async function initializeTools(agent: ContractManagerMCP) {
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
    'list_programs',
    {
      title: 'List Programs',
      description: 'List all programs in the contract management system',
    },
    async () => {
      const programs = await programService.getAll();
      const programLinks = programs.map(createProgramResourceLink);
      return {
        content: [createText(`Found ${programs.length} programs.`), ...programLinks],
      };
    }
  );

  agent.server.registerTool(
    'list_contracts',
    {
      title: 'List Contracts',
      description: 'List all contracts in the contract management system',
    },
    async () => {
      const contracts = await contractService.getAll();
      const contractLinks = contracts.map(createContractResourceLink);
      return {
        content: [createText(`Found ${contracts.length} contracts.`), ...contractLinks],
      };
    }
  );

  agent.server.registerTool(
    'list_tasks',
    {
      title: 'List Tasks',
      description: 'List all tasks in the contract management system',
    },
    async () => {
      const tasks = await taskService.getAll();
      const taskLinks = tasks.map(createTaskResourceLink);
      return {
        content: [createText(`Found ${tasks.length} tasks.`), ...taskLinks],
      };
    }
  );

  agent.server.registerTool(
    'list_tags',
    {
      title: 'List Tags',
      description: 'List all tags in the contract management system',
    },
    async () => {
      const tags = await tagService.getAll();
      const tagLinks = tags.map(createTagResourceLink);
      return {
        content: [createText(`Found ${tags.length} tags.`), ...tagLinks],
      };
    }
  );

  // Individual get tools
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
    'get_program',
    {
      title: 'Get Program',
      description: 'Get a program by its code',
      inputSchema: programCodeSchema,
    },
    async ({ code }) => {
      const program = await programService.getByCode(code);
      assert(program, `Program with code "${code}" not found`);
      return {
        content: [createProgramEmbeddedResource(program)],
      };
    }
  );

  agent.server.registerTool(
    'get_contract',
    {
      title: 'Get Contract',
      description: 'Get a contract by its code',
      inputSchema: contractCodeSchema,
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      return {
        content: [createContractEmbeddedResource(contract)],
      };
    }
  );

  agent.server.registerTool(
    'get_task',
    {
      title: 'Get Task',
      description: 'Get a task by its code',
      inputSchema: taskCodeSchema,
    },
    async ({ code }) => {
      const task = await taskService.getByCode(code);
      assert(task, `Task with code "${code}" not found`);
      return {
        content: [createTaskEmbeddedResource(task)],
      };
    }
  );

  agent.server.registerTool(
    'get_tag',
    {
      title: 'Get Tag',
      description: 'Get a tag by its code',
      inputSchema: tagCodeSchema,
    },
    async ({ code }) => {
      const tag = await tagService.getByCode(code);
      assert(tag, `Tag with code "${code}" not found`);
      return {
        content: [createTagEmbeddedResource(tag)],
      };
    }
  );

  // Task CRUD tools
  agent.server.registerTool(
    'create_task',
    {
      title: 'Create Task',
      description: 'Create a new task',
      inputSchema: createTaskInputSchema,
    },
    async taskData => {
      const createdTask = await taskService.createWithCode(taskData);
      return {
        content: [
          createText(
            `Task "${createdTask.name}" created successfully with code "${createdTask.code}"`
          ),
          createTaskEmbeddedResource(createdTask),
        ],
      };
    }
  );

  agent.server.registerTool(
    'update_task',
    {
      title: 'Update Task',
      description: 'Update a task. Fields that are not provided will not be updated.',
      inputSchema: updateTaskInputSchema,
    },
    async ({ code, ...updates }) => {
      const existingTask = await taskService.getByCode(code);
      assert(existingTask, `Task with code "${code}" not found`);
      const updatedTask = await taskService.updateByCode(code, updates);
      return {
        content: [
          createText(`Task "${updatedTask.name}" (code: ${code}) updated successfully`),
          createTaskEmbeddedResource(updatedTask),
        ],
      };
    }
  );

  agent.server.registerTool(
    'delete_task',
    {
      title: 'Delete Task',
      description: 'Delete a task',
      inputSchema: taskCodeSchema,
    },
    async ({ code }) => {
      const existingTask = await taskService.getByCode(code);
      assert(existingTask, `Task with code "${code}" not found`);
      await taskService.deleteByCode(code);
      return {
        content: [
          createText(`Task "${existingTask.name}" (code: ${code}) deleted successfully`),
          createTaskEmbeddedResource(existingTask),
        ],
      };
    }
  );

  agent.server.registerTool(
    'get_tasks_by_contract',
    {
      title: 'Get Tasks by Contract',
      description: 'Get all tasks for a specific contract',
      inputSchema: contractCodeSchema,
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      const tasks = await taskService.getByContractCode(code);
      const taskLinks = tasks.map(createTaskResourceLink);
      return {
        content: [
          createText(`Found ${tasks.length} tasks for contract "${contract.name}" (${code}).`),
          ...taskLinks,
        ],
      };
    }
  );

  // Employee tools
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

  // Tag tools
  agent.server.registerTool(
    'create_tag',
    {
      title: 'Create Tag',
      description: 'Create a new tag with a unique name',
      inputSchema: createTagInputSchema,
    },
    async tagData => {
      const createdTag = await tagService.createWithCode(tagData);
      return {
        content: [
          createText(
            `Tag "${createdTag.name}" created successfully with code "${createdTag.code}"`
          ),
          createTagEmbeddedResource(createdTag),
        ],
      };
    }
  );

  agent.server.registerTool(
    'edit_tag',
    {
      title: 'Edit Tag',
      description: 'Update a tag. The new name must be unique.',
      inputSchema: updateTagInputSchema,
    },
    async ({ code, ...updates }) => {
      const existingTag = await tagService.getByCode(code);
      assert(existingTag, `Tag with code "${code}" not found`);
      const updatedTag = await tagService.updateByCode(code, updates);
      return {
        content: [
          createText(`Tag "${updatedTag.name}" (code: ${code}) updated successfully`),
          createTagEmbeddedResource(updatedTag),
        ],
      };
    }
  );

  agent.server.registerTool(
    'delete_tag',
    {
      title: 'Delete Tag',
      description: 'Delete a tag',
      inputSchema: tagCodeSchema,
    },
    async ({ code }) => {
      const existingTag = await tagService.getByCode(code);
      assert(existingTag, `Tag with code "${code}" not found`);
      await tagService.deleteByCode(code);
      return {
        content: [
          createText(`Tag "${existingTag.name}" (code: ${code}) deleted successfully`),
          createTagEmbeddedResource(existingTag),
        ],
      };
    }
  );

  agent.server.registerTool(
    'add_tag_to_task',
    {
      title: 'Add Tag to Task',
      description: 'Apply a tag to a task',
      inputSchema: tagTaskSchema,
    },
    async ({ tag_code, task_code }) => {
      const tag = await tagService.getByCode(tag_code);
      const task = await taskService.getByCode(task_code);
      assert(tag, `Tag with code "${tag_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await tagService.addToTask(tag_code, task_code);

      return {
        content: [
          createText(
            `Tag "${tag.name}" (${tag_code}) applied to task "${task.name}" (${task_code}) successfully`
          ),
          createTagEmbeddedResource(tag),
          createTaskEmbeddedResource(task),
        ],
      };
    }
  );

  agent.server.registerTool(
    'remove_tag_from_task',
    {
      title: 'Remove Tag from Task',
      description: 'Remove a tag from a task',
      inputSchema: tagTaskSchema,
    },
    async ({ tag_code, task_code }) => {
      const tag = await tagService.getByCode(tag_code);
      const task = await taskService.getByCode(task_code);
      assert(tag, `Tag with code "${tag_code}" not found`);
      assert(task, `Task with code "${task_code}" not found`);

      await tagService.removeFromTask(tag_code, task_code);

      return {
        content: [
          createText(
            `Tag "${tag.name}" (${tag_code}) removed from task "${task.name}" (${task_code}) successfully`
          ),
          createTagEmbeddedResource(tag),
          createTaskEmbeddedResource(task),
        ],
      };
    }
  );
}

function createText(text: unknown): CallToolResult['content'][number] {
  if (typeof text === 'string') {
    return { type: 'text', text };
  } else {
    return { type: 'text', text: JSON.stringify(text) };
  }
}

type ResourceLinkContent = Extract<CallToolResult['content'][number], { type: 'resource_link' }>;

function createResourceLink(
  entityType: string,
  code: string,
  name: string,
  description: string
): ResourceLinkContent {
  return {
    type: 'resource_link',
    uri: `contract-manager://${entityType}/${code}`,
    name: `${code}: ${name}`,
    description,
    mimeType: 'application/json',
  };
}

function createEmployeeResourceLink(employee: Employee): ResourceLinkContent {
  return createResourceLink(
    'employees',
    employee.code,
    employee.name,
    `Employee: "${employee.name}" - ${employee.job_title}`
  );
}

function createProgramResourceLink(program: Program): ResourceLinkContent {
  return createResourceLink(
    'programs',
    program.code,
    program.name,
    `Program: "${program.name}" - ${program.description || 'No description'}`
  );
}

function createContractResourceLink(contract: Contract): ResourceLinkContent {
  return createResourceLink(
    'contracts',
    contract.code,
    contract.name,
    `Contract: "${contract.name}" - ${contract.description}`
  );
}

function createTaskResourceLink(task: Task): ResourceLinkContent {
  return createResourceLink(
    'tasks',
    task.code,
    task.name,
    `Task: "${task.name}" - Completion: ${task.completion_value}/10`
  );
}

function createTagResourceLink(tag: Tag): ResourceLinkContent {
  return createResourceLink('tags', tag.code, tag.name, `Tag: "${tag.name}"`);
}

type ResourceContent = CallToolResult['content'][number];

function createEmployeeEmbeddedResource(employee: Employee): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://employees/${employee.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(employee),
    },
  };
}

function createProgramEmbeddedResource(program: Program): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://programs/${program.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(program),
    },
  };
}

function createContractEmbeddedResource(contract: Contract): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://contracts/${contract.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(contract),
    },
  };
}

function createTaskEmbeddedResource(task: Task): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://tasks/${task.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(task),
    },
  };
}

function createTagEmbeddedResource(tag: Tag): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://tags/${tag.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(tag),
    },
  };
}
