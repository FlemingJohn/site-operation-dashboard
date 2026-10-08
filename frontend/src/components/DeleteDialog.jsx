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

const DeleteDialog = ({
  open,
  title,
  message,
  confirmText,
  children,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  const [typedText, setTypedText] = useState('');
  const isConfirmed = !confirmText || typedText.trim() === confirmText;

  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ transition: { onExited: () => setTypedText('') } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>{message}</DialogContentText>
          {children}
          {confirmText && (
            <TextField
              id="delete-confirm-text"
              label={`Type "${confirmText}" to confirm`}
              placeholder={confirmText}
              size="small"
              fullWidth
              autoComplete="off"
              value={typedText}
              onChange={(event) => setTypedText(event.target.value)}
              disabled={isDeleting}
            />
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isDeleting || !isConfirmed}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
