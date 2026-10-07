import { randomUUID } from 'node:crypto';
import { pinoHttp } from 'pino-http';
import { logger, serializeError } from '../utils/logger.js';

const HEALTH_CHECK_PATH = '/api/health';

const describe = (req, res) => `${req.method} ${req.originalUrl} ${res.statusCode}`;

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const requestId = randomUUID();
    res.setHeader('X-Request-Id', requestId);
    return requestId;
  },
  autoLogging: { ignore: (req) => req.url === HEALTH_CHECK_PATH },
  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res, responseTime) => `${describe(req, res)} - ${responseTime}ms`,
  customErrorMessage: (req, res) => describe(req, res),
  customProps: (req, res) => (res.locals.fieldErrors ? { errors: res.locals.fieldErrors } : {}),
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
    err: serializeError,
  },
});
