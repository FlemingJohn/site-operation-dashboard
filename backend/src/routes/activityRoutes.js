import { Router } from 'express';
import * as activityController from '../controllers/activityController.js';
import { validate } from '../middleware/validate.js';
import { activityListQuery } from '../validators/activitySchemas.js';

export const activityRoutes = Router();

activityRoutes.get('/', validate({ query: activityListQuery }), activityController.list);
activityRoutes.get('/people', activityController.listPeople);
