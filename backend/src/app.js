import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { requestLogger } from './middleware/requestLogger.js';
import { routes } from './routes/index.js';

export const app = express();

app.disable('x-powered-by');
app.use(requestLogger);
app.use(cors({ origin: env.CORS_ORIGIN, exposedHeaders: ['X-Request-Id', 'Idempotent-Replayed'] }));
app.use(express.json());
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
