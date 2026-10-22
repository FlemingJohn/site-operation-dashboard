import { Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import ReorderForm from './ReorderForm';

const ReorderDialog = ({ part, onClose, onSaved }) => (
  <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Reorder {part.name}</DialogTitle>
    <DialogContent>
      <Stack spacing={2}>
        <DialogContentText>
          {part.stock} in stock. The shelf holds {part.capacity}.
        </DialogContentText>
        <ReorderForm part={part} onSaved={() => onSaved(part)} onCancel={onClose} />
      </Stack>
    </DialogContent>
  </Dialog>
);

export default ReorderDialog;
