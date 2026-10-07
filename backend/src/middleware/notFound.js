import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

export const notFound = () => {
  throw new HttpError(404, MESSAGES.routeNotFound);
};
