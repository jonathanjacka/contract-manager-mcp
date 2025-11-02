import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { programService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import { z } from 'zod';
import {
  programCodeSchema,
  programListOutputSchema,
  programOutputSchema,
} from '../schemas/schema.js';
import { createText, createProgramResourceLink, createProgramEmbeddedResource } from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export async function registerProgramTools(agent: ContractManagerMCP) {
  const updateProgramToolsAvailability = async () => {
    const programs = await programService.getAll();
    const hasPrograms = programs.length > 0;

    if (hasPrograms) {
      getProgramTool.enable();
    } else {
      getProgramTool.disable();
    }
  };

  agent.server.registerTool(
    'list_programs',
    {
      title: 'List Programs',
      description: 'List all programs in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      outputSchema: programListOutputSchema,
    },
    async () => {
      const programs = await programService.getAll();
      const programLinks = programs.map(createProgramResourceLink);
      const structuredContent = {
        programs,
        count: programs.length,
      };
      return {
        content: [
          createText(`Found ${programs.length} programs.`),
          ...programLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  const getProgramTool = agent.server.registerTool(
    'get_program',
    {
      title: 'Get Program',
      description: 'Get a program by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: programCodeSchema,
      outputSchema: { program: z.object(programOutputSchema) },
    },
    async ({ code }) => {
      const program = await programService.getByCode(code);
      assert(program, `Program with code "${code}" not found`);
      const structuredContent = { program };
      return {
        content: [createProgramEmbeddedResource(program), createText(structuredContent)],
        structuredContent,
      };
    }
  );

  await updateProgramToolsAvailability();
}
