import { useId, useState } from 'react';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { requestPart } from '../api/sparePartsApi';
import { getErrorText } from '../lib/getErrorText';
import TechnicianSelect from './TechnicianSelect';

const ReorderForm = ({ part, defaults = {}, onSaved, onCancel }) => {
  const id = useId();
  const [quantity, setQuantity] = useState(String(defaults.quantity ?? part.capacity - part.stock));
  const [requestedBy, setRequestedBy] = useState(defaults.requestedBy ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const amount = Number(quantity);
  const canSave = Number.isInteger(amount) && amount > 0 && Boolean(requestedBy) && !isSaving;

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await requestPart({ partId: part.id, requestedBy, quantity: amount }, idempotencyKey);
      onSaved({ part, quantity: amount });
    } catch (err) {
      setError(getErrorText(err));
      setIsSaving(false);
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={save}>
      <div className="action-form-fields">
        <TextField
          id={`${id}-quantity`}
          type="number"
          label="How many"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
        />
        <TechnicianSelect
          id={`${id}-requested-by`}
          label="Asked by"
          value={requestedBy}
          onChange={setRequestedBy}
        />
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" className="form-actions">
        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={!canSave}>
          {isSaving ? 'Sending…' : 'Send request'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ReorderForm;
