import { Button, Typography } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import StartupStatusRow from './StartupStatusRow';

const StartupFailedCard = ({ database, onRetry }) => (
  <section className="startup-card" role="alert">
    <span className="startup-mark startup-mark-failed" aria-hidden="true">
      <ReportProblemOutlinedIcon />
    </span>
    <Typography variant="h6" component="h2" className="startup-title">
      SiteOps couldn&apos;t start
    </Typography>
    <Typography variant="body2" color="text.secondary" className="startup-text">
      The server did not answer within 90 seconds. Please try again in a minute.
    </Typography>
    <ul className="startup-rows">
      <StartupStatusRow label="Server" state={database === 'failed' ? 'ready' : 'failed'} />
      <StartupStatusRow
        label="Database"
        state={database === 'failed' ? 'failed' : 'waiting'}
        note={database === 'failed' ? 'Unreachable' : 'Not checked'}
      />
    </ul>
    <Button variant="contained" onClick={onRetry}>
      Try again
    </Button>
  </section>
);

export default StartupFailedCard;
