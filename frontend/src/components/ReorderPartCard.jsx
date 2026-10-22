import { useState } from 'react';
import { Typography } from '@mui/material';
import ChatSavedNote from './ChatSavedNote';
import ReorderForm from './ReorderForm';

const ReorderPartCard = ({ part, quantity, requestedBy, onOpenRecord }) => {
  const [outcome, setOutcome] = useState(null);

  if (outcome === 'cancelled') {
    return (
      <Typography variant="caption" color="text.secondary">
        Not sent.
      </Typography>
    );
  }
  if (outcome) {
    return (
      <ChatSavedNote
        text={`Request for ${outcome.quantity} × ${part.name} sent. It now waits in Requested.`}
        link={{ label: 'Spare parts', path: '/spare-parts' }}
        onOpenRecord={onOpenRecord}
      />
    );
  }

  return (
    <div className="chat-action-card">
      <div className="chat-action-title">
        <Typography variant="subtitle2" component="h3">
          Reorder {part.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {part.stock} in stock · shelf holds {part.capacity}
        </Typography>
      </div>
      <ReorderForm
        part={part}
        defaults={{ quantity, requestedBy }}
        onSaved={setOutcome}
        onCancel={() => setOutcome('cancelled')}
      />
    </div>
  );
};

export default ReorderPartCard;
