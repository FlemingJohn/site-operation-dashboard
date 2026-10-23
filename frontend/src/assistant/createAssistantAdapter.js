import { askAssistant } from '../api/assistantApi';
import { getChatMessages } from '../api/chatSessionsApi';
import { createChunkMapper } from './createChunkMapper';
import { isDraftChatId } from './draftChatId';
import { toChatMessage } from './toChatMessage';

export const createAssistantAdapter = ({ onSession }) => ({
  async listMessages({ conversationId }) {
    if (isDraftChatId(conversationId)) return { messages: [], hasMore: false };
    const { data } = await getChatMessages(conversationId);
    return { messages: data.map((row) => toChatMessage(row, conversationId)), hasMore: false };
  },

  async sendMessage({ conversationId, message, signal }) {
    const question = readQuestion(message);
    const sessionId = isDraftChatId(conversationId) ? undefined : conversationId;
    const mapper = createChunkMapper({ messageId: crypto.randomUUID(), onSession });

    return new ReadableStream({
      async start(controller) {
        const send = (chunks) => chunks.forEach((chunk) => controller.enqueue(chunk));
        send(mapper.start());
        try {
          await askAssistant({ sessionId, question }, (event) => send(mapper.map(event)), signal);
          send(mapper.stop());
        } catch (error) {
          if (!signal?.aborted) send(mapper.fail(error.message));
        }
        controller.close();
      },
    });
  },
});

const readQuestion = (message) =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
