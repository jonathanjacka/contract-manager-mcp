import type { ContractManagerMCP } from '../index.js';
import { contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import { z } from 'zod';
import {
  contractCodeSchema,
  contractListOutputSchema,
  contractOutputSchema,
} from '../schemas/schema.js';
import { createText, createContractResourceLink, createContractEmbeddedResource } from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export function registerContractTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'list_contracts',
    {
      title: 'List Contracts',
      description: 'List all contracts in the contract management system',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      outputSchema: contractListOutputSchema,
    },
    async () => {
      const contracts = await contractService.getAll();
      const contractLinks = contracts.map(createContractResourceLink);
      const structuredContent = {
        contracts,
        count: contracts.length,
      };
      return {
        content: [
          createText(`Found ${contracts.length} contracts.`),
          ...contractLinks,
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );

  agent.server.registerTool(
    'get_contract',
    {
      title: 'Get Contract',
      description: 'Get a contract by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: contractCodeSchema,
      outputSchema: { contract: z.object(contractOutputSchema) },
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      const structuredContent = { contract };
      return {
        content: [createContractEmbeddedResource(contract), createText(structuredContent)],
        structuredContent,
      };
    }
  );
}
