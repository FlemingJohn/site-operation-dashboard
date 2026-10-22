import { Button, Typography } from '@mui/material';
import { STATE_ICONS } from '../stateIcons';
import CardIcon from './CardIcon';
import StatusChip from './StatusChip';
import StockMeter from './StockMeter';

const StockLevelRow = ({ part, onReorder }) => (
  <li className="stock-row">
    <CardIcon {...STATE_ICONS.stock[part.stockLevel]} />
    <div className="stock-row-text">
      <Typography variant="body2" className="text-strong">
        {part.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Shelf holds up to {part.capacity}
      </Typography>
    </div>
    <StockMeter part={part} />
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
