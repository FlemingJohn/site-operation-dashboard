import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const ChatHeaderActions = ({ onNewChat, canFullScreen, isFull, onToggleFull, onClose }) => (
  <div className="chat-header-actions">
    <Tooltip title="New chat">
      <IconButton size="small" aria-label="New chat" onClick={onNewChat}>
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    {canFullScreen && (
      <Tooltip title={isFull ? 'Exit full screen (Esc)' : 'Full screen'}>
        <IconButton
          size="small"
          aria-label={isFull ? 'Exit full screen' : 'Full screen'}
          onClick={onToggleFull}
        >
          {isFull ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    )}
    <Tooltip title="Close">
      <IconButton size="small" aria-label="Close" onClick={onClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </div>
);

export default ChatHeaderActions;
