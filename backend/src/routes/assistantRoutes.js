import { Router } from 'express';
import * as assistantController from '../controllers/assistantController.js';
import { assistantLimit } from '../middleware/rateLimits.js';
import { validate } from '../middleware/validate.js';
import { assistantBody } from '../validators/assistantSchemas.js';

export const assistantRoutes = Router();

assistantRoutes.post(
  '/',
  assistantLimit,
  validate({ body: assistantBody }),
  assistantController.ask
);
