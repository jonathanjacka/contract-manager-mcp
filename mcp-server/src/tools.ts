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
