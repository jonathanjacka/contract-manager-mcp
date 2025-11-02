import { z } from 'zod';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { contractService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import {
  contractCodeSchema,
  contractListOutputSchema,
  contractOutputSchema,
} from '../schemas/schema.js';
import { createText, createContractResourceLink, createContractEmbeddedResource } from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';

export async function registerContractTools(agent: ContractManagerMCP) {
  // Initialize state from database
  const initialContracts = await contractService.getAll();
  let hasContracts = initialContracts.length > 0;

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

  const getContractTool = agent.server.registerTool(
    'get_contract',
    {
      title: 'Get Contract',
      description: 'Get a contract by its code',
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: contractCodeSchema,
      outputSchema: {
        contract: z.object(contractOutputSchema),
        summary: z.string().optional(),
      },
    },
    async ({ code }) => {
      const contract = await contractService.getByCode(code);
      assert(contract, `Contract with code "${code}" not found`);
      let summary: string | undefined = undefined;
      const clientCapabilities = agent.server.server.getClientCapabilities?.();
      if (clientCapabilities?.sampling && agent.server.server.elicitInput) {
        const elicitResult = await agent.server.server.elicitInput({
          message: 'Would you like a summary of this contract included?',
          requestedSchema: {
            type: 'object',
            properties: {
              includeSummary: {
                type: 'boolean',
                description: 'Whether to include a summary',
              },
            },
          },
        });
        const includeSummary =
          elicitResult.action === 'accept' && elicitResult.content?.['includeSummary'] === true;
        if (includeSummary) {
          const systemPrompt =
            'You are a helpful assistant. Summarize the following contract in 2-4 sentences for a business audience.';
          const userContent = {
            name: contract.name,
            description: contract.description,
          };
          try {
            const result = await agent.server.server.createMessage({
              systemPrompt,
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    mimeType: 'application/json',
                    text: JSON.stringify(userContent),
                  },
                },
              ],
              maxTokens: 150,
            });
            summary =
              typeof result.content.text === 'string'
                ? result.content.text
                : String(result.content.text);
          } catch (error) {
            await agent.server.server.sendLoggingMessage?.({
              level: 'error',
              data: {
                message: 'Error parsing contract summary',
                modelResponse: error instanceof Error ? error.message : String(error),
                error: error instanceof Error ? error.message : error,
              },
            });
            summary = undefined;
          }
        }
      }
      const structuredContent = summary !== undefined ? { contract, summary } : { contract };
      const contentArr = [createContractEmbeddedResource(contract), createText(structuredContent)];
      if (summary !== undefined) {
        contentArr.push(createText('Summary: ' + summary));
      }
      return {
        content: contentArr,
        structuredContent,
      };
    }
  );

  // Set initial tool states based on database state (without triggering notifications)
  if (!hasContracts) {
    getContractTool.disable();
  }
}
