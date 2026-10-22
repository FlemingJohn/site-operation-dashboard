import { ASSISTANT_STOPPED_TEXT } from '../constants';

export const toChatMessage = (row, conversationId) => ({
  id: row.id,
  conversationId,
  role: row.role,
  parts: row.role === 'user' ? [{ type: 'text', text: row.text }] : toAnswerParts(row),
  createdAt: row.createdAt,
  status: 'sent',
});

const toAnswerParts = (row) => {
  if (row.status === 'error') return [{ type: 'data-error', data: { message: row.text } }];
  return [
    row.text && { type: 'text', text: row.text },
    row.card && { type: 'data-card', data: row.card },
    hasRecords(row) && {
      type: 'data-records',
      data: { records: row.records, sources: row.sources },
    },
    row.status === 'stopped' && { type: 'data-error', data: { message: ASSISTANT_STOPPED_TEXT } },
  ].filter(Boolean);
};

const hasRecords = (row) => row.records.length > 0 || row.sources.length > 0;
