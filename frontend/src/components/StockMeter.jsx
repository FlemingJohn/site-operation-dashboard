import { Typography } from '@mui/material';
import StockBar from './StockBar';

const StockMeter = ({ part }) => (
  <div className="stock-meter">
    <div className="stock-meter-numbers">
      <Typography variant="body2" component="span" className="stock-meter-count">
        {part.stock} / {part.capacity}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Reorder at {part.reorderAt}
      </Typography>
    </div>
    <StockBar part={part} />
  </div>
);

export default StockMeter;
