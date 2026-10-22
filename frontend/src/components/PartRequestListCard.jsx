import { Card, CardHeader, List, ListItem, ListItemText } from '@mui/material';
import { STATE_ICONS } from '../stateIcons';
import { formatDate } from '../utils';
import CardIcon from './CardIcon';
import EmptyState from './EmptyState';
import StatusChip from './StatusChip';

const PartRequestListCard = ({ requests }) => (
  <Card>
    <CardHeader
      avatar={<CardIcon {...STATE_ICONS.stock['']} />}
      title="Parts asked for"
      subheader="Spare parts requested for this machine"
    />
    {requests.length === 0 ? (
      <EmptyState title="No parts asked for this machine." />
    ) : (
      <List dense>
        {requests.map((request) => (
          <ListItem
            key={request.id}
            divider
            secondaryAction={<StatusChip status={request.status} />}
          >
            <ListItemText
              primary={`${request.quantity} × ${request.partName}`}
              secondary={`Asked by ${request.requestedBy} on ${formatDate(request.requestedOn)}`}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Card>
);

export default PartRequestListCard;
