import { useId, useState } from 'react';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { markServiceDone } from '../api/serviceApi';
import { SERVICE_INTERVAL_DAYS } from '../constants';
import { addDays } from '../lib/addDays';
import { getErrorText } from '../lib/getErrorText';
import { formatDate, getToday } from '../utils';
import TechnicianSelect from './TechnicianSelect';

const MarkDoneForm = ({ unit, defaults = {}, onSaved, onCancel }) => {
  const id = useId();
  const [doneOn, setDoneOn] = useState(defaults.doneOn ?? getToday());
  const [doneBy, setDoneBy] = useState(defaults.technicianId ?? '');
  const [notes, setNotes] = useState(defaults.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const canSave = Boolean(doneOn && doneBy) && !isSaving;

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const serviceRecord = { doneOn, technicianId: doneBy, notes: notes.trim() };
      await markServiceDone(unit.id, serviceRecord, idempotencyKey);
      onSaved({ unit, nextServiceOn: addDays(doneOn, SERVICE_INTERVAL_DAYS) });
    } catch (err) {
      setError(getErrorText(err));
      setIsSaving(false);
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={save}>
      <div className="action-form-fields">
        <TextField
          id={`${id}-done-on`}
          type="date"
          label="Done on"
          value={doneOn}
          onChange={(event) => setDoneOn(event.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: getToday() } }}
        />
        <TechnicianSelect
          id={`${id}-done-by`}
          label="Done by"
          value={doneBy}
          onChange={setDoneBy}
        />
      </div>
      <TextField
        id={`${id}-notes`}
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
      <Stack direction="row" className="form-actions">
        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={!canSave}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default MarkDoneForm;
