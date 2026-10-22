import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { requestLimit, writeLimit } from './middleware/rateLimits.js';
import { requestLogger } from './middleware/requestLogger.js';
import { requireJson } from './middleware/requireJson.js';
import { routes } from './routes/index.js';

export const app = express();

app.set('trust proxy', 1);
app.use(requestLogger);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CORS_ORIGIN, exposedHeaders: ['X-Request-Id', 'Idempotent-Replayed'] }));
app.use('/api', requestLimit, writeLimit);
app.use(requireJson);
app.use(express.json());
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
