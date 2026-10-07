import { Link } from 'react-router-dom';
import { Alert, Button, Stack } from '@mui/material';

const ErrorAlert = ({ message, onRetry, backTo, backLabel }) => {
  const hasActions = Boolean(onRetry || backTo);

  return (
    <Alert
      severity="error"
      action={
        hasActions ? (
          <Stack direction="row" spacing={1}>
            {onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )}
            {backTo && (
              <Button color="inherit" size="small" component={Link} to={backTo}>
                {backLabel}
              </Button>
            )}
          </Stack>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
};

export default ErrorAlert;
