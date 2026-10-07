import { Alert, Snackbar } from '@mui/material';

const AUTO_HIDE_MS = 3000;

const SuccessSnackbar = ({ message, onClose }) => (
  <Snackbar
    open={Boolean(message)}
    autoHideDuration={AUTO_HIDE_MS}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity="success" variant="filled" onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);

export default SuccessSnackbar;
