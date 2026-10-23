import { CircularProgress, Typography } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useAssistantStatus } from '../hooks/useAssistantStatus';

const ChatWakeBanner = () => {
  const { status } = useAssistantStatus();
  if (status !== 'waking' && status !== 'down') return null;

  return (
    <div className={`chat-wake-banner chat-wake-banner-${status}`} role="status">
      {status === 'waking' ? (
        <CircularProgress size={14} thickness={6} color="inherit" />
      ) : (
        <ReportProblemOutlinedIcon fontSize="small" />
      )}
      <Typography variant="body2" component="span">
        {status === 'waking'
          ? 'The assistant was asleep. It usually takes 30–60 s to start.'
          : "The assistant isn't answering right now. Questions will wait while it tries again."}
      </Typography>
    </div>
  );
};

export default ChatWakeBanner;
