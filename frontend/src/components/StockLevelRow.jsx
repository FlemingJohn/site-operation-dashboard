import { Button, Typography } from '@mui/material';
import StatusChip from './StatusChip';
import StockBar from './StockBar';

const StockLevelRow = ({ part, onReorder }) => (
  <li className="stock-row">
    <div className="stock-row-text">
      <Typography variant="body2" className="text-strong">
        {part.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {part.stock} in stock · reorder when it drops to {part.reorderAt}
      </Typography>
    </div>
    <StockBar part={part} />
    <StatusChip status={part.stockLevel} />
    <div className="stock-row-action">
      {part.stockLevel !== 'stocked' && onReorder && (
        <Button size="small" variant="outlined" onClick={() => onReorder(part)}>
          Reorder
        </Button>
      )}
    </div>
  </li>
);

export default StockLevelRow;
