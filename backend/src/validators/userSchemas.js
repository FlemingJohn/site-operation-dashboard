import { z } from 'zod';
import { USER_ROLES, USER_SORT_COLUMNS } from '../constants.js';
import { listQueryShape, optionalChoice, requiredText, sortShape } from './commonSchemas.js';

const PHONE_PATTERN = /^\+?\d[\d\s-]{5,17}\d$/;
const PHONE_MESSAGE = 'Enter a valid phone number.';

export const userBody = z.object({
  fullName: requiredText('Enter a full name.', 100),
  email: requiredText('Enter an email address.', 150)
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email address.' })),
  phone: z
    .string({ error: PHONE_MESSAGE })
    .trim()
    .regex(PHONE_PATTERN, PHONE_MESSAGE)
    .nullable()
    .default(null),
  role: z.enum(USER_ROLES, { error: 'Choose a role.' }).default('technician'),
});

export const userListQuery = z.object({
  ...listQueryShape,
  ...sortShape(USER_SORT_COLUMNS, { sortBy: 'fullName', order: 'asc' }),
  role: optionalChoice(USER_ROLES, 'Choose a valid role.'),
});
