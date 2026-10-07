import { pool } from '../config/database.js';

export const findAll = async ({ role }) => {
  const { rows } = await pool.query(
    `SELECT id, full_name AS "fullName", email, role
     FROM users
     WHERE $1::text IS NULL OR role = $1
     ORDER BY full_name`,
    [role ?? null]
  );
  return rows;
};
