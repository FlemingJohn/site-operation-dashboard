import { pool } from '../config/database.js';
import { CHAT_MEMORY_MESSAGES } from '../constants.js';

const MESSAGE_COLUMNS = `
  id::text AS id,
  role,
  text,
  card,
  records,
  sources,
  status,
  created_at AS "createdAt"
`;

export const findBySession = async (sessionId) => {
  const { rows } = await pool.query(
    `SELECT ${MESSAGE_COLUMNS} FROM chat_messages WHERE session_id = $1 ORDER BY id`,
    [sessionId]
  );
  return { data: rows };
};

export const findMemory = async (sessionId) => {
  const { rows } = await pool.query(
    `SELECT role, text, status FROM (
       SELECT id, role, text, status FROM chat_messages
       WHERE session_id = $1
       ORDER BY id DESC
       LIMIT $2
     ) recent
     ORDER BY id`,
    [sessionId, CHAT_MEMORY_MESSAGES * 2]
  );
  return keepAnsweredTurns(rows).slice(-CHAT_MEMORY_MESSAGES);
};

const keepAnsweredTurns = (rows) =>
  rows.flatMap((row, index) => {
    const answer = rows[index + 1];
    const isAnswered =
      row.role === 'user' && answer?.role === 'assistant' && answer.status === 'done';
    return isAnswered ? [toMemory(row), toMemory(answer)] : [];
  });

const toMemory = ({ role, text }) => ({ role, text });

export const add = (sessionId, message) =>
  pool.query(
    `INSERT INTO chat_messages (session_id, role, text, card, records, sources, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      sessionId,
      message.role,
      message.text,
      message.card ? JSON.stringify(message.card) : null,
      JSON.stringify(message.records ?? []),
      JSON.stringify(message.sources ?? []),
      message.status ?? 'done',
    ]
  );
