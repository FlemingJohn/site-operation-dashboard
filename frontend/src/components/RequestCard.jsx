import { Button, Card, CardContent, Typography } from '@mui/material';
import { formatDate } from '../utils';

const NEXT_STEP_LABELS = { requested: 'Mark as ordered', ordered: 'Mark as delivered' };

const describeRequestFor = (request) =>
  request.serial
    ? `For ${request.serial} at ${request.siteName ?? 'the warehouse'}`
    : 'For the store';

const RequestCard = ({ request, isMoving, onMove }) => (
  <Card variant="outlined" className="request-card">
    <CardContent className="request-card-content">
      <Typography variant="body2" className="text-strong">
        {request.quantity} × {request.partName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {describeRequestFor(request)}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Asked by {request.requestedBy ?? 'someone'} on {formatDate(request.requestedOn)}
      </Typography>
      {NEXT_STEP_LABELS[request.status] && (
        <Button
          size="small"
          variant="outlined"
          className="request-card-action"
          disabled={isMoving}
          onClick={() => onMove(request)}
        >
          {NEXT_STEP_LABELS[request.status]}
        </Button>
      )}
    </CardContent>
  </Card>
);

export default RequestCard;
