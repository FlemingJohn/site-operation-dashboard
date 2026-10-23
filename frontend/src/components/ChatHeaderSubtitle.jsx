import { Typography } from '@mui/material';
import { useChatStatus } from '@mui/x-chat-headless';

const ChatHeaderSubtitle = () => {
  const { isStreaming } = useChatStatus();

  return (
    <Typography variant="caption" className="chat-header-subtitle">
      {isStreaming ? 'Ask SiteOps · answering…' : 'Ask SiteOps · answers from your dashboard'}
    </Typography>
  );
};

export default ChatHeaderSubtitle;
