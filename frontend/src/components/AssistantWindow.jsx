import { useEffect, useRef, useState } from 'react';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MinimizeIcon from '@mui/icons-material/Minimize';
import AssistantComposer from './AssistantComposer';
import AssistantMessage from './AssistantMessage';
import AssistantShell from './AssistantShell';
import AssistantSuggestions from './AssistantSuggestions';

const AssistantWindow = ({ chat, isPhone, onMinimise, onClose, onOpenRecord }) => {
  const messageList = useRef(null);
  const [isFull, setIsFull] = useState(false);
  const layout = isPhone ? 'phone' : isFull ? 'full' : 'window';

  useEffect(() => {
    const list = messageList.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [chat.messages]);

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return;
    if (isFull) setIsFull(false);
    else onMinimise();
  };

  return (
    <AssistantShell layout={layout}>
      <Paper
        elevation={8}
        className="assistant-window"
        role="dialog"
        aria-label="Ask SiteOps"
        onKeyDown={handleKeyDown}
      >
        <div className="assistant-header">
          <AutoAwesomeOutlinedIcon fontSize="small" />
          <Typography variant="subtitle2" component="h2" className="assistant-title">
            Ask SiteOps
          </Typography>
          {!isPhone && (
            <Tooltip title={isFull ? 'Exit full screen (Esc)' : 'Full screen'}>
              <IconButton
                size="small"
                aria-label={isFull ? 'Exit full screen' : 'Full screen'}
                onClick={() => setIsFull(!isFull)}
              >
                {isFull ? (
                  <FullscreenExitIcon fontSize="small" />
                ) : (
                  <FullscreenIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Minimise">
            <IconButton size="small" aria-label="Minimise" onClick={onMinimise}>
              <MinimizeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close and clear the chat">
            <IconButton size="small" aria-label="Close and clear the chat" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        <div className="assistant-messages" ref={messageList}>
          {chat.messages.length === 0 && <AssistantSuggestions onPick={chat.ask} />}
          {chat.messages.map((message) => (
            <AssistantMessage key={message.id} message={message} onOpenRecord={onOpenRecord} />
          ))}
        </div>

        <AssistantComposer isDisabled={chat.isAnswering} onSend={chat.ask} />
        <Typography variant="caption" color="text.secondary" className="assistant-footnote">
          AI answers come from this dashboard&apos;s data and can be wrong. Check the linked
          records.
        </Typography>
      </Paper>
    </AssistantShell>
  );
};

export default AssistantWindow;
