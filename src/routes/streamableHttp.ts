import { Router } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { logger } from '../utils/logger.js';
import { ERROR_CODES } from '../constants.js';
import type { ContractManagerMCP } from '../contractManagerMCP.js';

export function createStreamableHTTPRoutes(contractManagerMCP: ContractManagerMCP) {
  const router = Router();

  router.post('/mcp', async (req, res) => {
    const mcpMethod = req.body?.method || 'unknown';
    const mcpId = req.body?.id !== undefined ? req.body.id : 'none';
    logger.mcpRequest(mcpMethod, mcpId);

    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      res.on('close', () => {
        logger.mcpClosed(mcpMethod, mcpId);
        transport.close();
      });

      await contractManagerMCP.server.connect(transport);
      logger.mcpConnected(mcpMethod, mcpId);

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      logger.mcpError(mcpMethod, mcpId, error);
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Internal error',
          data: error instanceof Error ? error.message : String(error),
        },
        id: null,
      });
    }
  });

  return router;
}
