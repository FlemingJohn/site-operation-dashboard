import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import { equipmentListQuery, serviceRecordBody } from '../validators/equipmentSchemas.js';

export const equipmentRoutes = Router();

equipmentRoutes.get('/', validate({ query: equipmentListQuery }), equipmentController.list);
equipmentRoutes.get('/:id', validate({ params: idParams }), equipmentController.getById);
equipmentRoutes.post(
  '/:id/service-records',
  validate({ params: idParams, body: serviceRecordBody }),
  idempotency,
  equipmentController.recordService
);
