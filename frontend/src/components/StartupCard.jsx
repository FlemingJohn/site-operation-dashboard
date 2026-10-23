import { LinearProgress, Typography } from '@mui/material';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { toStartupState } from '../assistant/toStartupState';
import { useAssistantStatus } from '../hooks/useAssistantStatus';
import { useElapsedSeconds } from '../hooks/useElapsedSeconds';
import { formatDuration } from '../lib/formatDuration';
import StartupStatusRow from './StartupStatusRow';

const USUAL_SECONDS = 20;
const MAX_PROGRESS = 95;

const StartupCard = ({ startedAt }) => {
  const seconds = useElapsedSeconds(startedAt, true);
  const { status } = useAssistantStatus();
  const progress = Math.min((seconds / USUAL_SECONDS) * 100, MAX_PROGRESS);

  return (
    <section className="startup-card" role="status" aria-live="polite">
      <span className="startup-mark" aria-hidden="true">
        <ApartmentOutlinedIcon />
      </span>
      <Typography variant="h6" component="h2" className="startup-title">
        Starting SiteOps… <span className="startup-timer">{formatDuration(seconds)}</span>
      </Typography>
      <Typography variant="body2" color="text.secondary" className="startup-text">
        The server sleeps when nobody uses it. It usually takes about {USUAL_SECONDS} seconds.
      </Typography>
      <ul className="startup-rows">
        <StartupStatusRow label="Server" state="waking" />
        <StartupStatusRow label="Database" state="waiting" />
        <StartupStatusRow label="Assistant" state={toStartupState(status)} />
      </ul>
      <LinearProgress variant="determinate" value={progress} className="startup-progress" />
    </section>
  );
};

export default StartupCard;
