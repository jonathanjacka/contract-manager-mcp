import { Router } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { logger } from '../utils/logger.js';
import { HEALTH_RESPONSE, getMcpInfoResponse, ERROR_CODES, SERVER_CONFIG } from '../constants.js';
import type { ContractManagerMCP } from '../index.js';

export function createRoutes(contractManagerMCP: ContractManagerMCP) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      ...HEALTH_RESPONSE,
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/mcp', (_req, res) => {
    res.status(200).json({
      ...getMcpInfoResponse(SERVER_CONFIG.getPort()),
      timestamp: new Date().toISOString(),
    });
  });

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
