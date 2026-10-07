import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';

const DeleteDialog = ({ open, title, message, error, isDeleting, onCancel, onConfirm }) => (
  <Dialog open={open} onClose={isDeleting ? undefined : onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Stack spacing={2}>
        <DialogContentText>{message}</DialogContentText>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isDeleting}>
        Cancel
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm} disabled={isDeleting}>
        {isDeleting ? 'Deleting…' : 'Delete'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
