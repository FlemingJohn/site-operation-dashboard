import { pickAnswer } from '../assistant/pickAnswer';
import { wait } from '../lib/wait';

const STEP_DELAY_MS = 500;
const WORD_DELAY_MS = 30;
const WORDS_PER_CHUNK = 3;

const splitIntoChunks = (text) => {
  const words = text.split(/(\s+)/);
  const chunks = [];
  for (let index = 0; index < words.length; index += WORDS_PER_CHUNK * 2) {
    chunks.push(words.slice(index, index + WORDS_PER_CHUNK * 2).join(''));
  }
  return chunks;
};

export const askAssistant = async (question, onEvent) => {
  onEvent({ type: 'thinking' });
  const answer = await pickAnswer(question);

  for (const label of answer.steps) {
    onEvent({ type: 'step', label });
    await wait(STEP_DELAY_MS);
  }

  for (const chunk of splitIntoChunks(answer.text)) {
    onEvent({ type: 'text', text: chunk });
    await wait(WORD_DELAY_MS);
  }

  onEvent({ type: 'done', records: answer.records, sources: answer.sources });
};
