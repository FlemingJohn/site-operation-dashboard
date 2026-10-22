import { z } from 'zod';
import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

export const VISITOR_HEADER = 'X-Visitor-Id';

const visitorId = z.uuid();

export const requireVisitor = (req, res, next) => {
  const result = visitorId.safeParse(req.get(VISITOR_HEADER));
  if (!result.success) throw new HttpError(400, MESSAGES.visitorMissing);
  req.visitorId = result.data;
  next();
};
