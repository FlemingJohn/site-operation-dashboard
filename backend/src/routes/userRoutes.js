import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { idempotency } from '../middleware/idempotency.js';
import { validate } from '../middleware/validate.js';
import { userBody, userListQuery } from '../validators/userSchemas.js';

export const userRoutes = Router();

userRoutes.get('/', validate({ query: userListQuery }), userController.list);
userRoutes.post('/', validate({ body: userBody }), idempotency, userController.create);
