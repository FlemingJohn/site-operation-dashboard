import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';
import * as summaryController from '../controllers/summaryController.js';
import { installationRoutes } from './installationRoutes.js';
import { siteRoutes } from './siteRoutes.js';
import { userRoutes } from './userRoutes.js';

export const routes = Router();

routes.get('/health', healthController.check);
routes.get('/summary', summaryController.getSummary);
routes.use('/sites', siteRoutes);
routes.use('/installations', installationRoutes);
routes.use('/users', userRoutes);
