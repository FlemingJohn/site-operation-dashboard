import { Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import MarkDoneForm from './MarkDoneForm';

const MarkDoneDialog = ({ unit, onClose, onSaved }) => (
  <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Mark check-up as done</DialogTitle>
    <DialogContent>
      <Stack spacing={2}>
        <DialogContentText>
          {EQUIPMENT_TYPE_LABELS[unit.type]} {unit.serial}
          {unit.siteName ? ` at ${unit.siteName}` : ''}
        </DialogContentText>
        <MarkDoneForm unit={unit} onSaved={() => onSaved(unit)} onCancel={onClose} />
      </Stack>
    </DialogContent>
  </Dialog>
);

export default MarkDoneDialog;
