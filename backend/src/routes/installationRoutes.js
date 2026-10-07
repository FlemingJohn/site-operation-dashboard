import { Router } from 'express';
import * as installationController from '../controllers/installationController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import { installationBody, installationListQuery } from '../validators/installationSchemas.js';

export const installationRoutes = Router();

installationRoutes.get('/', validate({ query: installationListQuery }), installationController.list);
installationRoutes.get('/:id', validate({ params: idParams }), installationController.getById);
installationRoutes.post(
  '/',
  validate({ body: installationBody }),
  idempotency,
  installationController.create
);
installationRoutes.put(
  '/:id',
  validate({ params: idParams, body: installationBody }),
  installationController.update
);
installationRoutes.delete('/:id', validate({ params: idParams }), installationController.remove);
