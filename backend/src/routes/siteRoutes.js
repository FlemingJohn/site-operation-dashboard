import { Router } from 'express';
import * as siteController from '../controllers/siteController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import { siteBody, siteListQuery } from '../validators/siteSchemas.js';

export const siteRoutes = Router();

siteRoutes.get('/', validate({ query: siteListQuery }), siteController.list);
siteRoutes.get('/:id', validate({ params: idParams }), siteController.getById);
siteRoutes.post('/', validate({ body: siteBody }), idempotency, siteController.create);
siteRoutes.put('/:id', validate({ params: idParams, body: siteBody }), siteController.update);
siteRoutes.delete('/:id', validate({ params: idParams }), siteController.remove);
