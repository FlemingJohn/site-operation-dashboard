import { Card, CardHeader, List, ListItem, ListItemText } from '@mui/material';
import { formatDate } from '../utils';
import EmptyState from './EmptyState';

const ServiceHistoryCard = ({ records }) => (
  <Card>
    <CardHeader title="Check-up history" subheader="Newest first" />
    {records.length === 0 ? (
      <EmptyState title="No check-ups recorded yet." />
    ) : (
      <List dense>
        {records.map((record) => (
          <ListItem key={record.id} divider>
            <ListItemText
              primary={`${formatDate(record.doneOn)} · ${record.notes}`}
              secondary={record.doneBy ? `Done by ${record.doneBy}` : 'Technician not recorded'}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Card>
);

export default ServiceHistoryCard;
