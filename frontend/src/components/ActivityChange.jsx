import { Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StatusChip from './StatusChip';

const ActivityChange = ({ change }) => {
  const [from, to] = change.length > 1 ? change : [null, change[0]];

  return (
    <div className="activity-change">
      <Typography variant="caption" color="text.secondary">
        {from ? 'Changed' : 'Now'}
      </Typography>
      {from && <StatusChip status={from} />}
      {from && <ArrowForwardIcon fontSize="inherit" aria-label="to" />}
      <StatusChip status={to} />
    </div>
  );
};

export default ActivityChange;
