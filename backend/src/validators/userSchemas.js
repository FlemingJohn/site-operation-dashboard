import { z } from 'zod';
import { USER_ROLES } from '../constants.js';
import { optionalChoice } from './commonSchemas.js';

export const userListQuery = z.object({
  role: optionalChoice(USER_ROLES, 'Choose a valid role.'),
});
