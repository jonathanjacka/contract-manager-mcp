import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { Employee, Program, Contract, Task, Tag } from '../types/database.js';

export function createText(text: unknown): CallToolResult['content'][number] {
  if (typeof text === 'string') {
    return { type: 'text', text };
  } else {
    return { type: 'text', text: JSON.stringify(text) };
  }
}

type ResourceLinkContent = Extract<CallToolResult['content'][number], { type: 'resource_link' }>;
type ResourceContent = CallToolResult['content'][number];

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

// Resource Link Functions
export function createEmployeeResourceLink(employee: Employee): ResourceLinkContent {
  return createResourceLink(
    'employees',
    employee.code,
    employee.name,
    `Employee: "${employee.name}" - ${employee.job_title}`
  );
}

export function createProgramResourceLink(program: Program): ResourceLinkContent {
  return createResourceLink(
    'programs',
    program.code,
    program.name,
    `Program: "${program.name}" - ${program.description || 'No description'}`
  );
}

export function createContractResourceLink(contract: Contract): ResourceLinkContent {
  return createResourceLink(
    'contracts',
    contract.code,
    contract.name,
    `Contract: "${contract.name}" - ${contract.description}`
  );
}

export function createTaskResourceLink(task: Task): ResourceLinkContent {
  return createResourceLink(
    'tasks',
    task.code,
    task.name,
    `Task: "${task.name}" - Completion: ${task.completion_value}/10`
  );
}

export function createTagResourceLink(tag: Tag): ResourceLinkContent {
  return createResourceLink('tags', tag.code, tag.name, `Tag: "${tag.name}"`);
}

// Embedded Resource Functions
export function createEmployeeEmbeddedResource(employee: Employee): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://employees/${employee.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(employee),
    },
  };
}

export function createProgramEmbeddedResource(program: Program): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://programs/${program.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(program),
    },
  };
}

export function createContractEmbeddedResource(contract: Contract): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://contracts/${contract.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(contract),
    },
  };
}

export function createTaskEmbeddedResource(task: Task): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://tasks/${task.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(task),
    },
  };
}

export function createTagEmbeddedResource(tag: Tag): ResourceContent {
  return {
    type: 'resource',
    resource: {
      uri: `contract-manager://tags/${tag.code}`,
      mimeType: 'application/json',
      text: JSON.stringify(tag),
    },
  };
}
