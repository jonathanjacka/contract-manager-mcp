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
