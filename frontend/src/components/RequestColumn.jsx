import { Button, Chip, LinearProgress, Typography } from '@mui/material';
import { getPartRequests } from '../api/sparePartsApi';
import { useLoadMore } from '../hooks/useLoadMore';
import ErrorAlert from './ErrorAlert';
import RequestCard from './RequestCard';

const COLUMN_PAGE_SIZE = 8;

const RequestColumn = ({ status, label, search, movingId, onMove }) => {
  const requests = useLoadMore(getPartRequests, { status, search }, COLUMN_PAGE_SIZE);
  const hiddenCount = requests.total - requests.items.length;

  return (
    <section className="request-column" aria-label={label}>
      <div className="request-column-header">
        <Typography variant="subtitle2" component="h3">
          {label}
        </Typography>
        <Chip label={requests.total} className="request-column-count" />
      </div>
      {requests.isLoading && <LinearProgress />}
      {requests.error && <ErrorAlert message={requests.error} />}
      {!requests.isLoading && requests.total === 0 && (
        <Typography variant="caption" color="text.secondary" className="request-column-empty">
          Nothing here.
        </Typography>
      )}
      {requests.items.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          isMoving={movingId === request.id}
          onMove={onMove}
        />
      ))}
      {requests.hasMore && (
        <Button size="small" disabled={requests.isLoading} onClick={requests.loadMore}>
          Show {Math.min(hiddenCount, COLUMN_PAGE_SIZE)} more
        </Button>
      )}
    </section>
  );
};

export default RequestColumn;
