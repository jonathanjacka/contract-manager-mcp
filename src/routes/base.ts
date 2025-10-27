import { Router } from 'express';
import {
  HEALTH_RESPONSE,
  getSSEInfoResponse,
  getHTTPInfoResponse,
  SERVER_CONFIG,
} from '../constants.js';

export function createBaseRoutes(transport: 'sse' | 'http' = 'sse') {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      ...HEALTH_RESPONSE,
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/mcp', (_req, res) => {
    const port = SERVER_CONFIG.getPort();
    const infoResponse = transport === 'sse' ? getSSEInfoResponse(port) : getHTTPInfoResponse(port);

    res.status(200).json({
      ...infoResponse,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
