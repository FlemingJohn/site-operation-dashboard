import { pool } from '../config/database.js';
import { CHAT_TITLE_LENGTH, MAX_CHATS_PER_VISITOR, MESSAGES } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';

const SESSION_COLUMNS = `
  s.id,
  s.title,
  s.created_at AS "createdAt",
  s.updated_at AS "updatedAt"
`;

const LAST_MESSAGE = `
  (SELECT m.text FROM chat_messages m WHERE m.session_id = s.id ORDER BY m.id DESC LIMIT 1)
`;

const MESSAGE_COUNT = `
  (SELECT COUNT(*)::int FROM chat_messages m WHERE m.session_id = s.id)
`;

export const findAll = async (visitorId) => {
  const { rows } = await pool.query(
    `SELECT ${SESSION_COLUMNS}, ${LAST_MESSAGE} AS "lastMessage", ${MESSAGE_COUNT} AS "messageCount"
     FROM chat_sessions s
     WHERE s.visitor_id = $1
     ORDER BY s.updated_at DESC
     LIMIT $2`,
    [visitorId, MAX_CHATS_PER_VISITOR]
  );
  return { data: rows };
};

export const findOwned = async (visitorId, id) => {
  const { rows } = await pool.query(
    `SELECT ${SESSION_COLUMNS} FROM chat_sessions s WHERE s.id = $1 AND s.visitor_id = $2`,
    [id, visitorId]
  );
  return requireFound(rows[0]);
};

export const create = async (visitorId, question) => {
  const { rows } = await pool.query(
    `INSERT INTO chat_sessions AS s (visitor_id, title) VALUES ($1, $2) RETURNING ${SESSION_COLUMNS}`,
    [visitorId, toTitle(question)]
  );
  await removeOldest(visitorId);
  return rows[0];
};

export const rename = async (visitorId, id, title) => {
  const { rows } = await pool.query(
    `UPDATE chat_sessions AS s SET title = $3 WHERE s.id = $1 AND s.visitor_id = $2
     RETURNING ${SESSION_COLUMNS}`,
    [id, visitorId, title]
  );
  return requireFound(rows[0]);
};

export const remove = async (visitorId, id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM chat_sessions WHERE id = $1 AND visitor_id = $2',
    [id, visitorId]
  );
  if (rowCount === 0) throw new HttpError(404, MESSAGES.chatNotFound);
};

export const removeAll = async (visitorId) => {
  const { rowCount } = await pool.query('DELETE FROM chat_sessions WHERE visitor_id = $1', [
    visitorId,
  ]);
  return { deleted: rowCount };
};

export const touch = (id) =>
  pool.query('UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1', [id]);

const removeOldest = (visitorId) =>
  pool.query(
    `DELETE FROM chat_sessions
     WHERE visitor_id = $1
       AND id NOT IN (
         SELECT id FROM chat_sessions WHERE visitor_id = $1 ORDER BY updated_at DESC LIMIT $2
       )`,
    [visitorId, MAX_CHATS_PER_VISITOR]
  );

const toTitle = (question) => {
  const title = question.trim().replace(/\s+/g, ' ');
  return title.length > CHAT_TITLE_LENGTH ? `${title.slice(0, CHAT_TITLE_LENGTH - 1)}…` : title;
};

const requireFound = (session) => {
  if (!session) throw new HttpError(404, MESSAGES.chatNotFound);
  return session;
};
