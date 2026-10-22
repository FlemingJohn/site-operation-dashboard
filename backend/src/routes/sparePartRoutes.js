import { Router } from 'express';
import * as sparePartController from '../controllers/sparePartController.js';
import { validate } from '../middleware/validate.js';
import { sparePartListQuery } from '../validators/sparePartSchemas.js';

export const sparePartRoutes = Router();

sparePartRoutes.get('/', validate({ query: sparePartListQuery }), sparePartController.list);
