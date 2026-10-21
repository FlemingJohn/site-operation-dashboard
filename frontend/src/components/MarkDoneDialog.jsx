import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { markServiceDone } from '../api/serviceApi';
import { EQUIPMENT_TYPE_LABELS, SERVICE_INTERVAL_DAYS } from '../constants';
import { useTechnicians } from '../hooks/useTechnicians';
import { addDays } from '../lib/addDays';
import { formatDate, getToday } from '../utils';

const MarkDoneDialog = ({ unit, onClose, onSaved }) => {
  const { technicians, error: techniciansError } = useTechnicians();
  const [doneOn, setDoneOn] = useState(getToday);
  const [doneBy, setDoneBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const canSave = Boolean(doneOn && doneBy) && !isSaving;

  const save = async () => {
    setIsSaving(true);
    setError('');
    try {
      await markServiceDone(unit.id, { doneOn, doneBy, notes: notes.trim() });
      onSaved(unit);
    } catch (err) {
      setError(err.message);
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
          <TextField
            id="service-done-by"
            select
            label="Done by"
            value={doneBy}
            onChange={(event) => setDoneBy(event.target.value)}
            helperText={techniciansError}
            error={Boolean(techniciansError)}
          >
            {technicians.map((technician) => (
              <MenuItem key={technician.id} value={technician.fullName}>
                {technician.fullName}
              </MenuItem>
            ))}
          </TextField>
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
