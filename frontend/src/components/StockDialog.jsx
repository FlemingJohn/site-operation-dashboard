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
import { setPartStock } from '../api/sparePartsApi';
import { getErrorText } from '../lib/getErrorText';
import { getStockLevel } from '../lib/getStockLevel';
import StatusChip from './StatusChip';
import StockMeter from './StockMeter';
import StockStepper from './StockStepper';

const MAX_REASON_LENGTH = 200;

const StockDialog = ({ part, onClose, onSaved }) => {
  const [stock, setStock] = useState(part.stock);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const preview = { ...part, stock, stockLevel: getStockLevel({ ...part, stock }) };

  const save = async () => {
    setIsSaving(true);
    setError('');
    try {
      onSaved(await setPartStock(part.id, stock, reason.trim()), part.stock);
    } catch (err) {
      setError(getErrorText(err));
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onClose={isSaving ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adjust stock · {part.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            Count the shelf, then set how many are there now. It was {part.stock}.
          </DialogContentText>
          <StockStepper value={stock} max={part.capacity} onChange={setStock} isDisabled={isSaving} />
          <div className="stock-dialog-preview">
            <StockMeter part={preview} />
            <StatusChip status={preview.stockLevel} />
          </div>
          <TextField
            id="stock-reason"
            label="Why, optional"
            placeholder="Counted the shelf"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            slotProps={{ htmlInput: { maxLength: MAX_REASON_LENGTH } }}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={isSaving || stock === part.stock}>
          {isSaving ? 'Saving…' : 'Save stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockDialog;
