import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import type { ContractManagerMCP } from '../index.js';
import { contractService, programService, taskService } from '../services/index.js';
import { assert } from '../utils/assert.js';

export function registerProgressReviewPrompt(agent: ContractManagerMCP) {
  agent.server.registerPrompt(
    'progress_review',
    {
      title: 'Progress Review',
      description: 'Create progress reports for contracts or programs with detailed analysis',
      argsSchema: {
        type: z
          .enum(['contract', 'program'])
          .describe('Type of progress review (contract or program)'),
        code: completable(
          z.string().describe('The code of the contract or program to review (e.g., C001, P001)'),
          async value => {
            // Return both contract and program codes for completion
            const contracts = await contractService.getAll();
            const programs = await programService.getAll();
            const contractCodes = contracts
              .map(contract => contract.code)
              .filter(code => code.toLowerCase().includes(value.toLowerCase()));
            const programCodes = programs
              .map(program => program.code)
              .filter(code => code.toLowerCase().includes(value.toLowerCase()));
            return [...contractCodes, ...programCodes];
          }
        ),
      },
    },
    async ({ type, code }) => {
      assert(type, 'type is required');
      assert(code, 'code is required');

      if (type === 'contract') {
        const contract = await contractService.getByCode(code);
        assert(contract, `Contract with code "${code}" not found`);

        const tasks = await taskService.getByContractCode(code);
        const program = await programService.getById(contract.program_id);

        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `
Create a comprehensive progress review for contract "${code}". Include:

1. **Executive Summary**: Overall status, key achievements, and major concerns
2. **Financial Status**: Budget utilization, value delivered, cost efficiency
3. **Timeline Analysis**: Schedule adherence, critical path items, delays
4. **Task Progress**: Completion rates, bottlenecks, quality metrics
5. **Risk Assessment**: Current risks, mitigation strategies, escalations needed
6. **Resource Utilization**: Team performance, capacity issues, skills gaps
7. **Next Steps**: Immediate actions, upcoming milestones, recommendations

Provide specific metrics, percentages, and actionable insights for stakeholders.
                `.trim(),
              },
            },
            {
              role: 'user',
              content: {
                type: 'resource',
                resource: {
                  uri: `contract-manager://contracts/${code}`,
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
                  name: `Tasks for Contract ${code}`,
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
                  uri: `contract-manager://programs/${program?.code || 'unknown'}`,
                  name: 'Program Context',
                  mimeType: 'application/json',
                  text: JSON.stringify(program),
                },
              },
            },
          ],
        };
      } else {
        // Program progress review
        const program = await programService.getByCode(code);
        assert(program, `Program with code "${code}" not found`);

        const contracts = await contractService.getByProgramId(program.id);
        const allTasks = await Promise.all(
          contracts.map(async contract => {
            const tasks = await taskService.getByContractCode(contract.code);
            return { contract: contract.code, tasks };
          })
        );

        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `
Create a comprehensive progress review for program "${code}". Include:

1. **Program Overview**: Strategic objectives, overall progress, key achievements
2. **Contract Portfolio**: Status of all contracts, performance comparison
3. **Financial Dashboard**: Program budget, contract values, cost efficiency across portfolio
4. **Timeline & Milestones**: Program schedule, critical dependencies, delays
5. **Resource Management**: Team utilization across contracts, skill deployment
6. **Risk Portfolio**: Program-level risks, contract-specific issues, mitigation strategies
7. **Strategic Recommendations**: Portfolio optimization, resource reallocation, next steps

Provide program-level insights and cross-contract analysis for executive decision-making.
                `.trim(),
              },
            },
            {
              role: 'user',
              content: {
                type: 'resource',
                resource: {
                  uri: `contract-manager://programs/${code}`,
                  mimeType: 'application/json',
                  text: JSON.stringify(program),
                },
              },
            },
            {
              role: 'user',
              content: {
                type: 'resource',
                resource: {
                  uri: `contract-manager://contracts`,
                  name: `Contracts for Program ${code}`,
                  mimeType: 'application/json',
                  text: JSON.stringify(contracts),
                },
              },
            },
            {
              role: 'user',
              content: {
                type: 'resource',
                resource: {
                  uri: `contract-manager://program-tasks`,
                  name: 'All Tasks by Contract',
                  mimeType: 'application/json',
                  text: JSON.stringify(allTasks),
                },
              },
            },
          ],
        };
      }
    }
  );
}
