import { ButtonBase, Typography } from '@mui/material';
import CardIcon from './CardIcon';

const SummaryTile = ({ label, count, icon, tone, isSelected = false, onSelect }) => (
  <ButtonBase
    className={`summary-tile${isSelected ? ' summary-tile-selected' : ''}`}
    onClick={onSelect}
    disabled={!onSelect}
    aria-pressed={onSelect ? isSelected : undefined}
  >
    <span className="summary-tile-text">
      <Typography variant="h5" component="span" className="summary-tile-count">
        {count ?? '–'}
      </Typography>
      <Typography variant="body2" component="span" color="text.secondary">
        {label}
      </Typography>
    </span>
    {icon && <CardIcon icon={icon} tone={tone} />}
  </ButtonBase>
);

export default SummaryTile;
