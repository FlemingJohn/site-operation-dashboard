import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { moveRequest } from '../api/sparePartsApi';
import { STATUS_LABELS } from '../constants';
import { getErrorText } from '../lib/getErrorText';
import ChatSavedNote from './ChatSavedNote';

const ConfirmMoveCard = ({
  request,
  fromStatus,
  toStatus,
  stockBefore,
  stockAfter,
  onOpenRecord,
}) => {
  const [outcome, setOutcome] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const toLabel = STATUS_LABELS[toStatus];
  const hasStockChange = stockBefore !== undefined && stockAfter !== undefined;

  const confirm = async () => {
    setIsSaving(true);
    setError('');
    try {
      await moveRequest(request.id, toStatus);
      setOutcome('saved');
    } catch (err) {
      setError(getErrorText(err));
      setIsSaving(false);
    }
  };

  if (outcome === 'cancelled') {
    return (
      <Typography variant="caption" color="text.secondary">
        Left as {STATUS_LABELS[fromStatus]}.
      </Typography>
    );
  }
  if (outcome) {
    return (
      <ChatSavedNote
        text={`${request.partName} marked as ${toLabel.toLowerCase()}.${hasStockChange ? ` Stock is now ${stockAfter}.` : ''}`}
        link={{ label: 'Spare parts', path: '/spare-parts' }}
        onOpenRecord={onOpenRecord}
      />
    );
  }

  return (
    <div className="chat-action-card">
      <Typography variant="subtitle2" component="h3">
        Move {request.quantity} × {request.partName} to {toLabel}?
      </Typography>
      <Typography variant="caption" color="text.secondary">
        It is {STATUS_LABELS[fromStatus]} now
        {request.serial ? ` · for ${request.serial}` : ''}
        {hasStockChange ? `. Stock goes from ${stockBefore} to ${stockAfter}.` : '.'}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" className="form-actions">
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => setOutcome('cancelled')}
          disabled={isSaving}
        >
          Not yet
        </Button>
        <Button variant="contained" onClick={confirm} disabled={isSaving}>
          {isSaving ? 'Saving…' : `Mark ${toLabel.toLowerCase()}`}
        </Button>
      </Stack>
    </div>
  );
};

export default ConfirmMoveCard;
