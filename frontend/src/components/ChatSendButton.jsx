import { IconButton, Tooltip } from '@mui/material';
import { ChatComposerSendButton } from '@mui/x-chat';
import { useChatActions, useChatStatus } from '@mui/x-chat-headless';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

const ChatSendButton = (props) => {
  const { isStreaming } = useChatStatus();
  const { stopStreaming } = useChatActions();

  if (isStreaming) {
    return (
      <Tooltip title="Stop the answer">
        <IconButton aria-label="Stop the answer" onClick={stopStreaming} className="chat-stop">
          <StopRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <ChatComposerSendButton {...props} className="chat-send">
      <ArrowForwardRoundedIcon fontSize="small" />
    </ChatComposerSendButton>
  );
};

export default ChatSendButton;
