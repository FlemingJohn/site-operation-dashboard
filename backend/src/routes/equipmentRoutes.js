import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import {
  equipmentBody,
  equipmentListQuery,
  serviceRecordBody,
} from '../validators/equipmentSchemas.js';

export const equipmentRoutes = Router();

equipmentRoutes.get('/', validate({ query: equipmentListQuery }), equipmentController.list);
equipmentRoutes.get('/counts', validate({ query: equipmentListQuery }), equipmentController.counts);
equipmentRoutes.get('/:id', validate({ params: idParams }), equipmentController.getById);
equipmentRoutes.post(
  '/',
  validate({ body: equipmentBody }),
  idempotency,
  equipmentController.create
);
equipmentRoutes.put(
  '/:id',
  validate({ params: idParams, body: equipmentBody }),
  equipmentController.update
);
equipmentRoutes.delete('/:id', validate({ params: idParams }), equipmentController.remove);
equipmentRoutes.post(
  '/:id/service-records',
  validate({ params: idParams, body: serviceRecordBody }),
  idempotency,
  equipmentController.recordService
);
