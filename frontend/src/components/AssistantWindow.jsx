import { useEffect, useRef } from 'react';
import { Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import AssistantComposer from './AssistantComposer';
import AssistantMessage from './AssistantMessage';
import AssistantSuggestions from './AssistantSuggestions';

const AssistantWindow = ({ chat, onMinimise, onClose, onOpenRecord }) => {
  const messageList = useRef(null);

  useEffect(() => {
    const list = messageList.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [chat.messages]);

  return (
    <Paper
      elevation={8}
      className="assistant-window"
      role="dialog"
      aria-label="Ask SiteOps"
      onKeyDown={(event) => event.key === 'Escape' && onMinimise()}
    >
      <div className="assistant-header">
        <AutoAwesomeOutlinedIcon fontSize="small" />
        <Typography variant="subtitle2" component="h2" className="assistant-title">
          Ask SiteOps
        </Typography>
        <Chip label="Preview" className="assistant-preview" />
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
        Answers come from this dashboard&apos;s data and can be wrong. Check the linked records.
      </Typography>
    </Paper>
  );
};

export default AssistantWindow;
