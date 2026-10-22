import { CircularProgress, Typography } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const ChatStepPart = ({ part }) => {
  const isDone = part.toolInvocation.state === 'output-available';

  return (
    <div className="assistant-step">
      {isDone ? (
        <CheckCircleOutlineOutlinedIcon fontSize="inherit" className="assistant-step-done" />
      ) : (
        <CircularProgress size={12} />
      )}
      <Typography variant="caption" color="text.secondary">
        {part.toolInvocation.toolName}
      </Typography>
    </div>
  );
};

export default ChatStepPart;
