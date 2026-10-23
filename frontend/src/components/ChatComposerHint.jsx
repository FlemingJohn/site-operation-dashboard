import { Typography } from '@mui/material';
import { useChatComposer, useChatStatus } from '@mui/x-chat-headless';
import { ASSISTANT_QUESTION_LIMIT } from '../constants';
import { useAssistantStatus } from '../hooks/useAssistantStatus';

const NEAR_LIMIT = 0.9;

const describeHint = (isStreaming, status) => {
  if (isStreaming) return 'Stop keeps what has arrived so far';
  if (status === 'waking') return 'Send now; it waits until the assistant is ready';
  return 'Enter to send · Shift + Enter for a new line';
};

const ChatComposerHint = () => {
  const { value } = useChatComposer();
  const { isStreaming } = useChatStatus();
  const { status } = useAssistantStatus();
  const isNearLimit = value.length >= ASSISTANT_QUESTION_LIMIT * NEAR_LIMIT;

  return (
    <div className="chat-composer-hint">
      <Typography variant="caption" color="text.secondary">
        {describeHint(isStreaming, status)}
      </Typography>
      <Typography variant="caption" color={isNearLimit ? 'error' : 'text.secondary'}>
        {value.length} / {ASSISTANT_QUESTION_LIMIT}
      </Typography>
    </div>
  );
};

export default ChatComposerHint;
