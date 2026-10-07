import pino from 'pino';
import { env } from '../config/env.js';

export const serializeError = (error) => {
  if (!(error instanceof Error)) return error;
  const { type, message, stack } = pino.stdSerializers.err(error);
  return { type, message, code: error.code, stack };
};

const baseOptions = {
  level: env.LOG_LEVEL,
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  serializers: { err: serializeError },
};

const developmentOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname,req,res,responseTime',
    },
  },
};

const productionOptions = {
  formatters: { level: (label) => ({ level: label }) },
};

export const logger = pino({
  ...baseOptions,
  ...(env.NODE_ENV === 'development' ? developmentOptions : productionOptions),
});
