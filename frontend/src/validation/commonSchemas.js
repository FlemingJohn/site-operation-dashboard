import { z } from 'zod';

export const requiredText = (message, maxLength) =>
  z
    .string({ error: message })
    .trim()
    .min(1, message)
    .max(maxLength, `Keep this under ${maxLength} characters.`);

export const positiveId = (message) =>
  z.coerce.number({ error: message }).int(message).positive(message);

export const optionalId = (message) =>
  z.preprocess((value) => (value === '' ? null : value), positiveId(message).nullable());

export const optionValues = (options) => options.map(({ value }) => value);

export const toFieldErrors = (issues) =>
  issues.reduce((errors, issue) => {
    const field = issue.path.join('.');
    return errors[field] ? errors : { ...errors, [field]: issue.message };
  }, {});
