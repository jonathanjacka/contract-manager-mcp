import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { tagService } from '../services/index.js';
import { assert } from '../utils/assert.js';
import type { ResourceAnnotations } from '../types/annotations.js';

export function registerTagResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'tags',
    'contract-manager://tags',
    {
      title: 'Tags',
      description: 'All tags currently in the database',
      annotations: {
        audience: ['user', 'assistant'],
        priority: 0.5,
      } satisfies ResourceAnnotations,
    },
    async uri => {
      const tags = await tagService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(tags),
            uri: uri.toString(),
          },
        ],
      };
    }
  );

  agent.server.registerResource(
    'tag',
    new ResourceTemplate('contract-manager://tags/{code}', {
      complete: {
        async code(value) {
          const tags = await tagService.getAll();
          return tags
            .map(tag => tag.code)
            .filter(code => code.toLowerCase().includes(value.toLowerCase()));
        },
      },
      list: undefined,
    }),
    {
      title: 'Tag',
      description: 'A single tag with the given code',
      annotations: {
        audience: ['user', 'assistant'],
        priority: 0.5,
      } satisfies ResourceAnnotations,
    },
    async (uri, { code }) => {
      assert(typeof code === 'string', `Invalid tag code: ${code}`);
      const tag = await tagService.getByCode(code);
      assert(tag, `Tag with code "${code}" not found`);
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(tag),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
