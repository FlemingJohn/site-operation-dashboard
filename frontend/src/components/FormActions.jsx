import { Link } from 'react-router-dom';
import { Button, Grid, Stack } from '@mui/material';

const FormActions = ({ cancelPath, submitLabel, isSubmitting }) => (
  <Grid size={12}>
    <Stack direction="row" spacing={1} className="form-actions">
      <Button component={Link} to={cancelPath} variant="outlined" color="inherit">
        Cancel
      </Button>
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </Stack>
  </Grid>
);

export default FormActions;
