import { createHash } from 'node:crypto';
import { pool } from '../config/database.js';

export const hashRequest = ({ method, path, body }) =>
  createHash('sha256').update(JSON.stringify({ method, path, body })).digest('hex');

export const reserve = async (key, requestHash) => {
  await pool.query(`DELETE FROM idempotency_keys WHERE created_at < NOW() - INTERVAL '24 hours'`);

  const inserted = await pool.query(
    `INSERT INTO idempotency_keys (key, request_hash)
     VALUES ($1, $2)
     ON CONFLICT (key) DO NOTHING
     RETURNING key`,
    [key, requestHash]
  );
  if (inserted.rowCount === 1) return { state: 'reserved' };

  const { rows } = await pool.query(
    `SELECT request_hash AS "requestHash", status_code AS "statusCode", response_body AS "body"
     FROM idempotency_keys
     WHERE key = $1`,
    [key]
  );
  const record = rows[0];

  if (!record) return reserve(key, requestHash);
  if (record.requestHash !== requestHash) return { state: 'mismatch' };
  if (record.statusCode === null) return { state: 'in_progress' };
  return { state: 'completed', statusCode: record.statusCode, body: record.body };
};

export const complete = (key, statusCode, body) =>
  pool.query(
    'UPDATE idempotency_keys SET status_code = $1, response_body = $2 WHERE key = $3',
    [statusCode, JSON.stringify(body), key]
  );

export const release = (key) => pool.query('DELETE FROM idempotency_keys WHERE key = $1', [key]);
