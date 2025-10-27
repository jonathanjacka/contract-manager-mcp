import { Router } from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { logger } from '../utils/logger.js';
import { HEALTH_RESPONSE, getMcpInfoResponse, ERROR_CODES, SERVER_CONFIG } from '../constants.js';
import type { ContractManagerMCP } from '../index.js';

export function createRoutes(contractManagerMCP: ContractManagerMCP) {
  const router = Router();

  // Store active SSE transports by session ID
  const activeTransports = new Map<string, SSEServerTransport>();

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

  // SSE connection endpoint - establishes persistent connection
  router.get('/mcp/sse', async (_req, res) => {
    try {
      logger.info('SSE connection request received');

      const transport = new SSEServerTransport('/mcp/messages', res, {
        allowedOrigins: ['http://localhost:6274', 'http://localhost:3000', 'http://localhost:8080'],
        enableDnsRebindingProtection: true,
      });

      // Set up transport event handlers
      transport.onclose = () => {
        logger.info(`SSE transport closed for session: ${transport.sessionId}`);
        activeTransports.delete(transport.sessionId);
      };

      transport.onerror = error => {
        logger.error(`SSE transport error for session ${transport.sessionId}:`, error);
        activeTransports.delete(transport.sessionId);
      };

      // Store the transport for message routing
      activeTransports.set(transport.sessionId, transport);

      // Connect the MCP server to this transport (automatically calls start())
      await contractManagerMCP.server.connect(transport);
      logger.info(`MCP server connected to SSE transport: ${transport.sessionId}`);

      // SSE stream is started automatically by connect()
      logger.info(`SSE stream started for session: ${transport.sessionId}`);
    } catch (error) {
      logger.error('SSE connection error:', error);
      // Only send error response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to establish SSE connection',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
  });

  // Alternative SSE endpoint for Inspector compatibility
  router.get('/sse', async (_req, res) => {
    try {
      logger.info('SSE connection request received (Inspector endpoint)');

      const transport = new SSEServerTransport('/messages', res, {
        allowedOrigins: ['http://localhost:6274', 'http://localhost:3000', 'http://localhost:8080'],
        enableDnsRebindingProtection: true,
      });

      // Set up transport event handlers
      transport.onclose = () => {
        logger.info(`SSE transport closed for session: ${transport.sessionId}`);
        activeTransports.delete(transport.sessionId);
      };

      transport.onerror = error => {
        logger.error(`SSE transport error for session ${transport.sessionId}:`, error);
        activeTransports.delete(transport.sessionId);
      };

      // Store the transport for message routing
      activeTransports.set(transport.sessionId, transport);

      // Connect the MCP server to this transport (automatically calls start())
      await contractManagerMCP.server.connect(transport);
      logger.info(`MCP server connected to SSE transport: ${transport.sessionId}`);

      // SSE stream is started automatically by connect()
      logger.info(`SSE stream started for session: ${transport.sessionId}`);
    } catch (error) {
      logger.error('SSE connection error:', error);
      // Only send error response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to establish SSE connection',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
  });

  // Message endpoint - handles POST messages from SSE clients
  router.post('/mcp/messages', async (req, res) => {
    try {
      // Get session ID from header or query parameter (Inspector uses query param)
      const sessionId =
        (req.headers['x-session-id'] as string) || (req.query['sessionId'] as string);

      if (!sessionId) {
        res.status(400).json({
          error: 'Missing session ID (provide in X-Session-ID header or sessionId query parameter)',
        });
        return;
      }

      const transport = activeTransports.get(sessionId);

      if (!transport) {
        res.status(404).json({
          error: 'Session not found',
        });
        return;
      }

      const mcpMethod = req.body?.method || 'unknown';
      const mcpId = req.body?.id !== undefined ? req.body.id : 'none';
      logger.mcpRequest(mcpMethod, mcpId);

      // Handle the message through the SSE transport
      await transport.handlePostMessage(req, res, req.body);

      logger.info(`Message handled for session ${sessionId}: ${mcpMethod} (ID: ${mcpId})`);
    } catch (error) {
      logger.error('Message handling error:', error);
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

  // Alternative message endpoint for Inspector compatibility
  router.post('/messages', async (req, res) => {
    try {
      // Get session ID from header or query parameter (Inspector uses query param)
      const sessionId =
        (req.headers['x-session-id'] as string) || (req.query['sessionId'] as string);

      if (!sessionId) {
        res.status(400).json({
          error: 'Missing session ID (provide in X-Session-ID header or sessionId query parameter)',
        });
        return;
      }

      const transport = activeTransports.get(sessionId);

      if (!transport) {
        res.status(404).json({
          error: 'Session not found',
        });
        return;
      }

      const mcpMethod = req.body?.method || 'unknown';
      const mcpId = req.body?.id !== undefined ? req.body.id : 'none';
      logger.mcpRequest(mcpMethod, mcpId);

      // Handle the message through the SSE transport
      await transport.handlePostMessage(req, res, req.body);

      logger.info(`Message handled for session ${sessionId}: ${mcpMethod} (ID: ${mcpId})`);
    } catch (error) {
      logger.error('Message handling error:', error);
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

  // Fallback POST endpoint for compatibility with existing HTTP clients
  router.post('/mcp', async (_req, res) => {
    res.status(400).json({
      error: 'Direct POST to /mcp is not supported with SSE transport',
      message:
        'Please establish SSE connection first via GET /mcp/sse, then send messages to POST /mcp/messages',
      endpoints: {
        'SSE Connection': 'GET /mcp/sse',
        'Send Messages': 'POST /mcp/messages (with X-Session-ID header)',
      },
    });
  });

  return router;
}
