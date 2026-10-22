import { Link as RouterLink } from 'react-router-dom';
import { Chip, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const ChatSavedNote = ({ text, link, onOpenRecord }) => (
  <div className="chat-saved-note" role="status">
    <TaskAltIcon fontSize="small" />
    <Typography variant="body2">{text}</Typography>
    {link && (
      <Chip
        label={link.label}
        clickable
        component={RouterLink}
        to={link.path}
        onClick={onOpenRecord}
        className="assistant-record"
      />
    )}
  </div>
);

export default ChatSavedNote;
