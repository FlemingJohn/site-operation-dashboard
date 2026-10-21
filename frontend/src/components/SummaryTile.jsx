import { ButtonBase, Typography } from '@mui/material';

const SummaryTile = ({ label, count, isSelected = false, onSelect }) => (
  <ButtonBase
    className={`summary-tile${isSelected ? ' summary-tile-selected' : ''}`}
    onClick={onSelect}
    disabled={!onSelect}
    aria-pressed={onSelect ? isSelected : undefined}
  >
    <Typography variant="h5" component="span" className="summary-tile-count">
      {count ?? '–'}
    </Typography>
    <Typography variant="body2" component="span" color="text.secondary">
      {label}
    </Typography>
  </ButtonBase>
);

export default SummaryTile;
