import { Router } from 'express';
import * as sparePartController from '../controllers/sparePartController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import { sparePartBody, sparePartListQuery, stockBody } from '../validators/sparePartSchemas.js';

export const sparePartRoutes = Router();

sparePartRoutes.get('/', validate({ query: sparePartListQuery }), sparePartController.list);
sparePartRoutes.get('/counts', validate({ query: sparePartListQuery }), sparePartController.counts);
sparePartRoutes.get('/:id', validate({ params: idParams }), sparePartController.getById);
sparePartRoutes.post(
  '/',
  validate({ body: sparePartBody }),
  idempotency,
  sparePartController.create
);
sparePartRoutes.put(
  '/:id',
  validate({ params: idParams, body: sparePartBody }),
  sparePartController.update
);
sparePartRoutes.patch(
  '/:id/stock',
  validate({ params: idParams, body: stockBody }),
  sparePartController.setStock
);
sparePartRoutes.delete('/:id', validate({ params: idParams }), sparePartController.remove);
