import { Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RecordChip from './RecordChip';

const ChatSavedNote = ({ text, link, onOpenRecord }) => (
  <div className="chat-saved-note" role="status">
    <TaskAltIcon fontSize="small" />
    <Typography variant="body2">{text}</Typography>
    {link && <RecordChip label={link.label} path={link.path} onOpen={onOpenRecord} />}
  </div>
);

export default ChatSavedNote;
