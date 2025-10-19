import { type CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { employeeService } from './services/database.js';
import type { Employee } from './types/database.js';

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

      return {
        content: [
          {
            type: 'text',
            text: `Found ${employees.length} employees.`,
          },
          ...employees.map(employee => ({
            type: 'resource_link' as const,
            uri: `contract-manager://employees/${employee.id}`,
            name: employee.name,
            description: `Employee: "${employee.name}" - ${employee.job_title}`,
            mimeType: 'application/json',
          })),
        ],
      };
    }
  );
}

// Helper functions for return patterns
function createText(text: unknown): CallToolResult['content'][number] {
  if (typeof text === 'string') {
    return { type: 'text', text };
  } else {
    return { type: 'text', text: JSON.stringify(text) };
  }
}

type ResourceLinkContent = Extract<CallToolResult['content'][number], { type: 'resource_link' }>;

function createEmployeeResourceLink(employee: Employee): ResourceLinkContent {
  return {
    type: 'resource_link',
    uri: `contract-manager://employees/${employee.id}`,
    name: employee.name,
    description: `Employee: "${employee.name}" - ${employee.job_title}`,
    mimeType: 'application/json',
  };
}

// Additional helper functions can be added here as needed
// Example: createEmployeeEmbeddedResource() for detailed employee data
