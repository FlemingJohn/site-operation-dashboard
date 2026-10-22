import { Link as RouterLink } from 'react-router-dom';
import { Chip } from '@mui/material';

const RecordChip = ({ label, path, icon: Icon, onOpen }) => (
  <Chip
    size="small"
    variant="outlined"
    clickable
    component={RouterLink}
    to={path}
    onClick={onOpen}
    icon={Icon ? <Icon /> : undefined}
    label={label}
    className="record-chip"
  />
);

export default RecordChip;
