import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { taskService, employeeService, contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';

export function registerTeamAssignmentPrompt(agent: ContractManagerMCP) {
  agent.server.registerPrompt(
    'team_assignment',
    {
      title: 'Team Assignment',
      description: 'Suggest employee assignments based on skills, workload, and task requirements',
      argsSchema: {
        taskCode: completable(
          z.string().describe('The code of the task to assign team members to (e.g., T001)'),
          async value => {
            const tasks = await taskService.getAll();
            return tasks
              .map(task => task.code)
              .filter(code => code.toLowerCase().includes(value.toLowerCase()));
          }
        ),
      },
    },
    async ({ taskCode }) => {
      assert(taskCode, 'taskCode is required');

      const task = await taskService.getByCode(taskCode);
      assert(task, `Task with code "${taskCode}" not found`);

      const contract = await contractService.getById(task.contract_id);
      const currentAssignees = await employeeService.getByTaskCode(taskCode);
      const allEmployees = await employeeService.getAll();

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `
Please suggest optimal team assignments for task "${taskCode}". Consider:

1. **Skills Match**: Which employees have the right skills/job titles for this task?
2. **Team Composition**: Mix of skills and experience levels needed
3. **Current Assignment**: Who is already assigned and whether changes are needed
4. **Knowledge Transfer**: Opportunities for mentoring and skill development

Provide specific recommendations for:
- Who should be assigned to this task and why
- Who should be removed from current assignments if necessary
- How to balance the team composition
- Any skill gaps that need to be addressed

If you recommend assignment changes, you can use the "add_employee_to_task" and "remove_employee_from_task" tools to make the assignments.
              `.trim(),
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://tasks/${taskCode}`,
                mimeType: 'application/json',
                text: JSON.stringify(task),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://contracts/${contract?.code || 'unknown'}`,
                name: 'Contract Context',
                mimeType: 'application/json',
                text: JSON.stringify(contract),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://task-assignments/${taskCode}`,
                name: 'Current Assignees',
                mimeType: 'application/json',
                text: JSON.stringify(currentAssignees),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://employees`,
                name: 'All Available Employees',
                mimeType: 'application/json',
                text: JSON.stringify(allEmployees),
              },
            },
          },
        ],
      };
    }
  );
}
