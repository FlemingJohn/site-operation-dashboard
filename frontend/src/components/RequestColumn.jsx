import { useState } from 'react';
import { Button, Chip, Typography } from '@mui/material';
import RequestCard from './RequestCard';

const COLUMN_PAGE_SIZE = 8;

const RequestColumn = ({ label, requests, movingId, onMove }) => {
  const [visibleCount, setVisibleCount] = useState(COLUMN_PAGE_SIZE);
  const hiddenCount = requests.length - visibleCount;

  return (
    <section className="request-column" aria-label={label}>
      <div className="request-column-header">
        <Typography variant="subtitle2" component="h3">
          {label}
        </Typography>
        <Chip label={requests.length} className="request-column-count" />
      </div>
      {requests.length === 0 && (
        <Typography variant="caption" color="text.secondary" className="request-column-empty">
          Nothing here.
        </Typography>
      )}
      {requests.slice(0, visibleCount).map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          isMoving={movingId === request.id}
          onMove={onMove}
        />
      ))}
      {hiddenCount > 0 && (
        <Button size="small" onClick={() => setVisibleCount(visibleCount + COLUMN_PAGE_SIZE)}>
          Show {Math.min(hiddenCount, COLUMN_PAGE_SIZE)} more
        </Button>
      )}
    </section>
  );
};

export default RequestColumn;
