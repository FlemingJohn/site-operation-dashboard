import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { requestPart } from '../api/sparePartsApi';
import TechnicianSelect from './TechnicianSelect';

const ReorderDialog = ({ part, onClose, onSaved }) => {
  const [quantity, setQuantity] = useState(String(part.capacity - part.stock));
  const [requestedBy, setRequestedBy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const amount = Number(quantity);
  const canSave = amount > 0 && Boolean(requestedBy) && !isSaving;

  const save = async () => {
    setIsSaving(true);
    setError('');
    try {
      await requestPart(part.id, { quantity: amount, requestedBy });
      onSaved(part);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onClose={isSaving ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reorder {part.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            {part.stock} in stock. The shelf holds {part.capacity}.
          </DialogContentText>
          <TextField
            id="reorder-quantity"
            type="number"
            label="How many"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TechnicianSelect
            id="reorder-requested-by"
            label="Asked by"
            value={requestedBy}
            onChange={setRequestedBy}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={!canSave}>
          {isSaving ? 'Sending…' : 'Send request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReorderDialog;
