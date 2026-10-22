import { useMessageContext } from '@mui/x-chat-headless';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const ChatAvatar = () => {
  const { role, isGrouped } = useMessageContext();
  if (role !== 'assistant' || isGrouped) return null;

  return (
    <span className="chat-avatar" aria-hidden="true">
      <AutoAwesomeOutlinedIcon fontSize="small" />
    </span>
  );
};

export default ChatAvatar;
