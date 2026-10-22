import { MESSAGES } from '../constants.js';
import { runTool } from './runTool.js';
import { streamModelTurn } from './streamModelTurn.js';

const MAX_ROUNDS = 3;
const MAX_RECORDS = 8;

export const runAssistant = async ({ question, history, signal, send }) => {
  const contents = [...history.map(toContent), toContent({ role: 'user', text: question })];
  const records = [];
  const sources = [];
  let hasAnswer = false;

  send({ type: 'thinking' });
  for (let round = 0; round < MAX_ROUNDS; round += 1) {
    const parts = await streamModelTurn({
      contents,
      canUseTools: round < MAX_ROUNDS - 1,
      signal,
      onText: (text) => {
        hasAnswer = true;
        send({ type: 'text', text });
      },
    });
    const calls = parts.filter((part) => part.functionCall).map((part) => part.functionCall);
    if (calls.length === 0) break;

    const results = await Promise.all(calls.map((call) => runTool(call, send)));
    contents.push({ role: 'model', parts });
    contents.push({ role: 'user', parts: results.map((result) => result.part) });
    results.forEach((result) => {
      records.push(...result.records);
      if (result.source) sources.push(result.source);
    });
  }

  if (!hasAnswer) send({ type: 'text', text: MESSAGES.assistantNoAnswer });
  send({ type: 'done', records: uniqueRecords(records).slice(0, MAX_RECORDS), sources });
};

const toContent = ({ role, text }) => ({
  role: role === 'assistant' ? 'model' : 'user',
  parts: [{ text }],
});

const uniqueRecords = (records) => [
  ...new Map(records.map((record) => [record.path + record.label, record])).values(),
];
