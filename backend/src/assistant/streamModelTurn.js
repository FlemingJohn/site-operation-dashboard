import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { TOOL_DECLARATIONS } from './assistantTools.js';
import { gemini } from './geminiClient.js';
import { getSystemInstruction } from './getSystemInstruction.js';
import { isRetryableError } from './isRetryableError.js';

const TEMPERATURE = 0.2;
const TURN_TIMEOUT_MS = 20000;

export const streamModelTurn = async ({ contents, canUseTools, signal, onText }) => {
  const models = [env.GEMINI_MODEL, env.GEMINI_FALLBACK_MODEL];
  let hasSentText = false;
  const trackText = (text) => {
    hasSentText = true;
    onText(text);
  };

  for (const [index, model] of models.entries()) {
    try {
      return await streamWithModel({ model, contents, canUseTools, signal, onText: trackText });
    } catch (error) {
      const canRetry = index < models.length - 1 && !hasSentText && !signal.aborted;
      if (!canRetry || !isRetryableError(error)) throw error;
      logger.warn({ err: error, model }, 'Gemini turn failed, trying the fallback model');
    }
  }
};

const streamWithModel = async ({ model, contents, canUseTools, signal, onText }) => {
  const stream = await gemini.models.generateContentStream({
    model,
    contents,
    config: buildConfig({ canUseTools, signal }),
  });

  const parts = [];
  for await (const chunk of stream) {
    const chunkParts = chunk.candidates?.[0]?.content?.parts ?? [];
    parts.push(...chunkParts);
    chunkParts.filter(isAnswerText).forEach((part) => onText(part.text));
  }
  return parts;
};

const buildConfig = ({ canUseTools, signal }) => ({
  systemInstruction: getSystemInstruction(),
  temperature: TEMPERATURE,
  tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
  toolConfig: { functionCallingConfig: { mode: canUseTools ? 'AUTO' : 'NONE' } },
  abortSignal: AbortSignal.any([signal, AbortSignal.timeout(TURN_TIMEOUT_MS)]),
});

const isAnswerText = (part) => part.text && !part.thought;
