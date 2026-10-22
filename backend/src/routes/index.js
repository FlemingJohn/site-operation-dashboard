import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';
import * as summaryController from '../controllers/summaryController.js';
import { activityRoutes } from './activityRoutes.js';
import { assistantRoutes } from './assistantRoutes.js';
import { chatSessionRoutes } from './chatSessionRoutes.js';
import { equipmentRoutes } from './equipmentRoutes.js';
import { installationRoutes } from './installationRoutes.js';
import { partRequestRoutes } from './partRequestRoutes.js';
import { siteRoutes } from './siteRoutes.js';
import { sparePartRoutes } from './sparePartRoutes.js';
import { userRoutes } from './userRoutes.js';

export const routes = Router();

routes.get('/health', healthController.check);
routes.get('/summary', summaryController.getSummary);
routes.use('/sites', siteRoutes);
routes.use('/installations', installationRoutes);
routes.use('/users', userRoutes);
routes.use('/equipment', equipmentRoutes);
routes.use('/spare-parts', sparePartRoutes);
routes.use('/part-requests', partRequestRoutes);
routes.use('/activity', activityRoutes);
routes.use('/assistant', assistantRoutes);
routes.use('/chat-sessions', chatSessionRoutes);
