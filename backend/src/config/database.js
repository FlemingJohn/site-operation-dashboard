import { readFileSync } from 'node:fs';
import pg from 'pg';
import { logger } from '../utils/logger.js';
import { env } from './env.js';

const DATE_TYPE_ID = 1082;

pg.types.setTypeParser(DATE_TYPE_ID, (value) => value);

const ssl = env.DATABASE_SSL ? { ca: readFileSync(env.DATABASE_SSL_CA, 'utf8') } : false;

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => {
  logger.error({ err: error }, 'Idle database client error');
});

export const checkDatabaseConnection = () => pool.query('SELECT 1');
