import { Typography } from '@mui/material';
import { useChatComposer, useChatStatus } from '@mui/x-chat-headless';
import { ASSISTANT_QUESTION_LIMIT } from '../constants';

const NEAR_LIMIT = 0.9;

const ChatComposerHint = () => {
  const { value } = useChatComposer();
  const { isStreaming } = useChatStatus();
  const isNearLimit = value.length >= ASSISTANT_QUESTION_LIMIT * NEAR_LIMIT;

  return (
    <div className="chat-composer-hint">
      <Typography variant="caption" color="text.secondary">
        {isStreaming
          ? 'Stop keeps what has arrived so far'
          : 'Enter to send · Shift + Enter for a new line'}
      </Typography>
      <Typography variant="caption" color={isNearLimit ? 'error' : 'text.secondary'}>
        {value.length} / {ASSISTANT_QUESTION_LIMIT}
      </Typography>
    </div>
  );
};

export default ChatComposerHint;
