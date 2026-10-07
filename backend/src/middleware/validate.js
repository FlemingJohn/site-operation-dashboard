import { MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

const collectFieldErrors = (issues, source, errors) => {
  issues.forEach((issue) => {
    const field = issue.path.join('.') || source;
    errors[field] ??= issue.message;
  });
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
      collectFieldErrors(result.error.issues, source, errors);
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, MESSAGES.fieldErrors, errors);
  }

  next();
};
