import { CircularProgress } from '@mui/material';
import { useChatStatus } from '@mui/x-chat-headless';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useAssistantStatus } from '../hooks/useAssistantStatus';

const ChatHeaderMark = () => {
  const { isStreaming } = useChatStatus();
  const { status } = useAssistantStatus();

  return (
    <span className="chat-header-mark" aria-hidden="true">
      <AutoAwesomeOutlinedIcon fontSize="small" />
      {isStreaming || status === 'waking' ? (
        <CircularProgress size={12} thickness={6} className="chat-header-busy" />
      ) : (
        <span className="chat-header-ready" />
      )}
    </span>
  );
};

export default ChatHeaderMark;
