import { Router } from 'express';
import * as partRequestController from '../controllers/partRequestController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import {
  partRequestBody,
  partRequestListQuery,
  partRequestStatusBody,
} from '../validators/partRequestSchemas.js';

export const partRequestRoutes = Router();

partRequestRoutes.get('/', validate({ query: partRequestListQuery }), partRequestController.list);
partRequestRoutes.post(
  '/',
  validate({ body: partRequestBody }),
  idempotency,
  partRequestController.create
);
partRequestRoutes.patch(
  '/:id',
  validate({ params: idParams, body: partRequestStatusBody }),
  partRequestController.updateStatus
);
