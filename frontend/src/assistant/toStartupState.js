const ASSISTANT_STATES = {
  checking: 'waiting',
  waking: 'waking',
  ready: 'ready',
  down: 'failed',
  off: 'off',
};

export const toStartupState = (assistantStatus) => ASSISTANT_STATES[assistantStatus] ?? 'waiting';
