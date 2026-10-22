import { ASSISTANT_STOPPED_TEXT } from '../constants';

const TEXT_ID = 'answer-text';

export const createChunkMapper = ({ messageId, onSession }) => {
  let isTextOpen = false;
  let openStepId = null;
  let stepCount = 0;
  let hasEnded = false;

  const closeStep = () => {
    if (!openStepId) return [];
    const chunk = { type: 'tool-output-available', toolCallId: openStepId, output: {} };
    openStepId = null;
    return [chunk];
  };

  const openStep = (label) => {
    stepCount += 1;
    openStepId = `step-${stepCount}`;
    return [
      { type: 'tool-input-start', toolCallId: openStepId, toolName: label, dynamic: true },
      {
        type: 'tool-input-available',
        toolCallId: openStepId,
        toolName: label,
        input: {},
        dynamic: true,
      },
    ];
  };

  const addText = (text) => {
    const start = isTextOpen ? [] : [...closeStep(), { type: 'text-start', id: TEXT_ID }];
    isTextOpen = true;
    return [...start, { type: 'text-delta', id: TEXT_ID, delta: text }];
  };

  const end = (lastParts) => {
    if (hasEnded) return [];
    hasEnded = true;
    const closeText = isTextOpen ? [{ type: 'text-end', id: TEXT_ID }] : [];
    return [...closeStep(), ...closeText, ...lastParts, { type: 'finish', messageId }];
  };

  const toRecords = ({ records = [], sources = [] }) =>
    records.length || sources.length ? [{ type: 'data-records', data: { records, sources } }] : [];

  const toError = (message) => [{ type: 'data-error', data: { message } }];

  return {
    start: () => [{ type: 'start', messageId }],
    map(event) {
      if (event.type === 'session') onSession(event.session);
      if (event.type === 'step') return [...closeStep(), ...openStep(event.label)];
      if (event.type === 'text') return addText(event.text);
      if (event.type === 'ui') return [{ type: 'data-card', data: event.card }];
      if (event.type === 'done') return end(toRecords(event));
      if (event.type === 'error') return end(toError(event.message));
      return [];
    },
    fail: (message) => end(toError(message)),
    stop: () => end(toError(ASSISTANT_STOPPED_TEXT)),
  };
};
