import { Router } from 'express';
import * as chatSessionController from '../controllers/chatSessionController.js';
import { requireVisitor } from '../middleware/requireVisitor.js';
import { validate } from '../middleware/validate.js';
import { renameBody, sessionParams } from '../validators/chatSessionSchemas.js';

export const chatSessionRoutes = Router();

chatSessionRoutes.use(requireVisitor);

chatSessionRoutes.get('/', chatSessionController.list);
chatSessionRoutes.delete('/', chatSessionController.removeAll);
chatSessionRoutes.get(
  '/:id/messages',
  validate({ params: sessionParams }),
  chatSessionController.listMessages
);
chatSessionRoutes.patch(
  '/:id',
  validate({ params: sessionParams, body: renameBody }),
  chatSessionController.rename
);
chatSessionRoutes.delete('/:id', validate({ params: sessionParams }), chatSessionController.remove);
