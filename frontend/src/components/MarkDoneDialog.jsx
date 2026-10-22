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
import { markServiceDone } from '../api/serviceApi';
import { EQUIPMENT_TYPE_LABELS, SERVICE_INTERVAL_DAYS } from '../constants';
import { addDays } from '../lib/addDays';
import { getErrorText } from '../lib/getErrorText';
import { formatDate, getToday } from '../utils';
import TechnicianSelect from './TechnicianSelect';

const MarkDoneDialog = ({ unit, onClose, onSaved }) => {
  const [doneOn, setDoneOn] = useState(getToday);
  const [doneBy, setDoneBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const canSave = Boolean(doneOn && doneBy) && !isSaving;

  const save = async () => {
    setIsSaving(true);
    setError('');
    try {
      const serviceRecord = { doneOn, technicianId: doneBy, notes: notes.trim() };
      await markServiceDone(unit.id, serviceRecord, idempotencyKey);
      onSaved(unit);
    } catch (err) {
      setError(getErrorText(err));
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onClose={isSaving ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Mark check-up as done</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            {EQUIPMENT_TYPE_LABELS[unit.type]} {unit.serial}
            {unit.siteName ? ` at ${unit.siteName}` : ''}
          </DialogContentText>
          <TextField
            id="service-done-on"
            type="date"
            label="Done on"
            value={doneOn}
            onChange={(event) => setDoneOn(event.target.value)}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: getToday() } }}
          />
          <TechnicianSelect
            id="service-done-by"
            label="Done by"
            value={doneBy}
            onChange={setDoneBy}
          />
          <TextField
            id="service-notes"
            label="What was done (optional)"
            multiline
            minRows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          {doneOn && (
            <Alert severity="info">
              The next check-up will be on {formatDate(addDays(doneOn, SERVICE_INTERVAL_DAYS))}.
            </Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={!canSave}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkDoneDialog;
