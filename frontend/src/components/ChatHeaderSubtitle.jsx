import { Typography } from '@mui/material';
import { useChatStatus } from '@mui/x-chat-headless';
import { useAssistantStatus } from '../hooks/useAssistantStatus';
import { useElapsedSeconds } from '../hooks/useElapsedSeconds';
import { formatDuration } from '../lib/formatDuration';

const ChatHeaderSubtitle = () => {
  const { isStreaming } = useChatStatus();
  const { status, since } = useAssistantStatus();
  const isWaking = status === 'waking' && !isStreaming;
  const seconds = useElapsedSeconds(since, isWaking);

  const text = isStreaming
    ? 'Ask SiteOps · answering…'
    : isWaking
      ? `Waking up the assistant… ${formatDuration(seconds)}`
      : 'Ask SiteOps · answers from your dashboard';

  return (
    <Typography
      variant="caption"
      className={`chat-header-subtitle${isWaking ? ' chat-header-subtitle-waking' : ''}`}
    >
      {text}
    </Typography>
  );
};

export default ChatHeaderSubtitle;
