import type { ContractManagerMCP } from '../index.js';
import { programService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import { programCodeSchema } from '../schemas/schema.js';
import { createText, createProgramResourceLink, createProgramEmbeddedResource } from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export function registerProgramTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'list_programs',
    {
      title: 'List Programs',
      description: 'List all programs in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
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
    'get_program',
    {
      title: 'Get Program',
      description: 'Get a program by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
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
}
