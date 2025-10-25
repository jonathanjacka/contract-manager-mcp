import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import type { ContractManagerMCP } from '../index.js';
import { contractService, taskService, employeeService } from '../services/index.js';
import { assert } from '../utils/assert.js';

export function registerContractAnalysisPrompt(agent: ContractManagerMCP) {
  agent.server.registerPrompt(
    'contract_analysis',
    {
      title: 'Contract Analysis',
      description: 'Analyze a specific contract with its tasks, team assignments, and progress',
      argsSchema: {
        contractCode: completable(
          z.string().describe('The code of the contract to analyze (e.g., C001)'),
          async value => {
            const contracts = await contractService.getAll();
            return contracts
              .map(contract => contract.code)
              .filter(code => code.toLowerCase().includes(value.toLowerCase()));
          }
        ),
      },
    },
    async ({ contractCode }) => {
      assert(contractCode, 'contractCode is required');

      const contract = await contractService.getByCode(contractCode);
      assert(contract, `Contract with code "${contractCode}" not found`);

      const tasks = await taskService.getByContractCode(contractCode);
      const allEmployees = await employeeService.getAll();

      // Get assigned employees for each task
      const taskEmployees = await Promise.all(
        tasks.map(async task => {
          const employees = await employeeService.getByTaskCode(task.code);
          return { task: task.code, employees };
        })
      );

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `
Please provide a comprehensive analysis of contract "${contractCode}". Focus on:

1. **Contract Overview**: Current status, value, timeline
2. **Task Analysis**: Progress, completion rates, blockers
3. **Team Performance**: Employee assignments, workload distribution
4. **Risk Assessment**: Delayed tasks, unassigned work, resource gaps
5. **Recommendations**: Action items, resource reallocation, timeline adjustments

Use the provided contract, task, and employee data to give actionable insights.
              `.trim(),
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://contracts/${contractCode}`,
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
                uri: `contract-manager://tasks`,
                name: `Tasks for ${contractCode}`,
                mimeType: 'application/json',
                text: JSON.stringify(tasks),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://employees`,
                name: 'Available Employees',
                mimeType: 'application/json',
                text: JSON.stringify(allEmployees),
              },
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: `contract-manager://task-assignments`,
                name: 'Task Employee Assignments',
                mimeType: 'application/json',
                text: JSON.stringify(taskEmployees),
              },
            },
          },
        ],
      };
    }
  );
}
