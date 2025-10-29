import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { programService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import type { ResourceAnnotations } from '../types/annotations.js';

export function registerProgramResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'programs',
    'contract-manager://programs',
    {
      title: 'Programs',
      description: 'All programs currently in the database',
      annotations: {
        audience: ['user', 'assistant'],
        priority: 1.0,
      } satisfies ResourceAnnotations,
    },
    async uri => {
      const programs = await programService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(programs),
            uri: uri.toString(),
          },
        ],
      };
    }
  );

  agent.server.registerResource(
    'program',
    new ResourceTemplate('contract-manager://programs/{code}', {
      complete: {
        async code(value) {
          const programs = await programService.getAll();
          return programs
            .map(program => program.code)
            .filter(code => code.toLowerCase().includes(value.toLowerCase()));
        },
      },
      list: undefined,
    }),
    {
      title: 'Program',
      description: 'A single program with the given code',
      annotations: {
        audience: ['user', 'assistant'],
        priority: 1.0,
      } satisfies ResourceAnnotations,
    },
    async (uri, { code }) => {
      assert(typeof code === 'string', `Invalid program code: ${code}`);
      const program = await programService.getByCode(code);
      assert(program, `Program with code "${code}" not found`);
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(program),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
