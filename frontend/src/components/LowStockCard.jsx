import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { getSpareParts } from '../api/sparePartsApi';
import { MAX_SELECT_OPTIONS } from '../constants';
import { useLoader } from '../hooks/useLoader';
import CardIcon from './CardIcon';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import StatusChip from './StatusChip';
import StockMeter from './StockMeter';

const SHOWN_COUNT = 4;
const NO_PARTS = { data: [] };

const loadParts = () => getSpareParts({ limit: MAX_SELECT_OPTIONS });

const LowStockCard = () => {
  const parts = useLoader(loadParts, NO_PARTS);
  const lowParts = parts.data.data.filter((part) => part.stockLevel !== 'stocked');

  return (
    <Card className="overview-list-card">
      <CardHeader
        avatar={<CardIcon icon={Inventory2OutlinedIcon} tone="neutral" />}
        title="Spare parts running low"
        subheader="Lowest stock first"
        action={
          <Button component={RouterLink} to="/spare-parts" variant="outlined">
            Open spare parts
          </Button>
        }
      />
      {parts.isLoading && <LinearProgress />}
      {parts.error && <ErrorAlert message={parts.error} onRetry={parts.reload} />}
      {!parts.isLoading && lowParts.length === 0 && (
        <EmptyState title="Every part is above its reorder level." />
      )}
      <List dense>
        {lowParts.slice(0, SHOWN_COUNT).map((part) => (
          <ListItem key={part.id} divider className="overview-list-item">
            <div className="overview-list-title">
              <Typography variant="body2" className="text-strong">
                {part.name}
              </Typography>
              <StatusChip status={part.stockLevel} />
            </div>
            <StockMeter part={part} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default LowStockCard;
