import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';
import * as summaryController from '../controllers/summaryController.js';
import * as userController from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { userListQuery } from '../validators/userSchemas.js';
import { installationRoutes } from './installationRoutes.js';
import { siteRoutes } from './siteRoutes.js';

export const routes = Router();

routes.get('/health', healthController.check);
routes.get('/summary', summaryController.getSummary);
routes.get('/users', validate({ query: userListQuery }), userController.list);
routes.use('/sites', siteRoutes);
routes.use('/installations', installationRoutes);
