import { z } from 'zod';
import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

const collectFieldErrors = (error, source, errors) => {
  const { formErrors, fieldErrors } = z.flattenError(error);
  Object.entries(fieldErrors).forEach(([field, messages]) => {
    errors[field] ??= messages[0];
  });
  if (formErrors.length > 0) errors[source] ??= formErrors[0];
};

export const validate = (schemas) => (req, res, next) => {
  const errors = {};
  req.validated = {};

  Object.entries(schemas).forEach(([source, schema]) => {
    const result = schema.safeParse(req[source] ?? {});

    if (result.success) {
      req.validated[source] = result.data;
    } else if (source === 'params') {
      throw new HttpError(400, result.error.issues[0].message);
    } else {
      collectFieldErrors(result.error, source, errors);
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, MESSAGES.fieldErrors, errors);
  }

  next();
};
