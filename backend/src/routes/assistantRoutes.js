import { Router } from 'express';
import * as assistantController from '../controllers/assistantController.js';
import { assistantLimit } from '../middleware/rateLimits.js';
import { requireVisitor } from '../middleware/requireVisitor.js';
import { validate } from '../middleware/validate.js';
import { assistantBody } from '../validators/assistantSchemas.js';

export const assistantRoutes = Router();

assistantRoutes.get('/status', assistantController.status);

assistantRoutes.post(
  '/',
  assistantLimit,
  requireVisitor,
  validate({ body: assistantBody }),
  assistantController.ask
);
