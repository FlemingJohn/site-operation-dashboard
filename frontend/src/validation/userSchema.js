import { z } from 'zod';
import { USER_ROLES } from '../constants';
import { optionValues, requiredText } from './commonSchemas';

const PHONE_PATTERN = /^\+?\d[\d\s-]{5,17}\d$/;
const PHONE_MESSAGE = 'Enter a valid phone number.';

export const userSchema = z.object({
  fullName: requiredText('Enter a full name.', 100),
  email: requiredText('Enter an email address.', 150)
    .toLowerCase()
    .pipe(z.email({ error: 'Enter a valid email address.' })),
  phone: z.preprocess(
    (value) => (value.trim() === '' ? null : value),
    z.string().trim().regex(PHONE_PATTERN, PHONE_MESSAGE).nullable()
  ),
  role: z.enum(optionValues(USER_ROLES), { error: 'Choose a role.' }),
});
