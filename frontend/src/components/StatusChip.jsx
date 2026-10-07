import { Chip } from '@mui/material';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

const StatusChip = ({ status }) => (
  <Chip label={STATUS_LABELS[status] ?? status} color={STATUS_COLORS[status] ?? 'default'} />
);

export default StatusChip;
