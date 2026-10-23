import { IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

const StockStepper = ({ value, max, onChange, isDisabled }) => (
  <div className="stock-stepper">
    <IconButton
      aria-label="One fewer"
      onClick={() => onChange(value - 1)}
      disabled={isDisabled || value <= 0}
      className="stock-stepper-button"
    >
      <RemoveOutlinedIcon />
    </IconButton>
    <Typography variant="h4" component="output" aria-live="polite" className="stock-stepper-count">
      {value}
    </Typography>
    <IconButton
      aria-label="One more"
      onClick={() => onChange(value + 1)}
      disabled={isDisabled || value >= max}
      className="stock-stepper-button"
    >
      <AddIcon />
    </IconButton>
  </div>
);

export default StockStepper;
