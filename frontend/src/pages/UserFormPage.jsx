import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { createUser } from '../api/userApi';
import { USER_ROLES } from '../constants';
import { useEntityForm } from '../hooks/useEntityForm';
import { userSchema } from '../validation/userSchema';

const EMPTY_USER = { fullName: '', email: '', phone: '', role: 'technician' };
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 150;
const MAX_PHONE_LENGTH = 20;

const saveUser = (user, id, idempotencyKey) => createUser(user, idempotencyKey);

const UserFormPage = () => {
  const form = useEntityForm({
    emptyValues: EMPTY_USER,
    schema: userSchema,
    save: saveUser,
    entityName: 'User',
    successPath: '/users',
  });

  return (
    <Card className="form-card">
      <CardHeader title="Add user" subheader="Register a new admin or technician" />
      <CardContent>
        <form onSubmit={form.handleSubmit} noValidate>
          <Grid container spacing={2}>
            {form.submitError && (
              <Grid size={12}>
                <Alert severity="error">{form.submitError}</Alert>
              </Grid>
            )}
            <Grid size={12}>
              <TextField
                id="user-full-name"
                name="fullName"
                label="Full name"
                fullWidth
                required
                value={form.values.fullName}
                onChange={form.handleChange}
                error={Boolean(form.errors.fullName)}
                helperText={form.errors.fullName}
                slotProps={{ htmlInput: { maxLength: MAX_NAME_LENGTH } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                id="user-email"
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                value={form.values.email}
                onChange={form.handleChange}
                error={Boolean(form.errors.email)}
                helperText={form.errors.email}
                slotProps={{ htmlInput: { maxLength: MAX_EMAIL_LENGTH } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="user-phone"
                name="phone"
                label="Phone"
                type="tel"
                fullWidth
                value={form.values.phone}
                onChange={form.handleChange}
                error={Boolean(form.errors.phone)}
                helperText={form.errors.phone}
                slotProps={{ htmlInput: { maxLength: MAX_PHONE_LENGTH } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="user-role"
                name="role"
                label="Role"
                select
                fullWidth
                value={form.values.role}
                onChange={form.handleChange}
                error={Boolean(form.errors.role)}
                helperText={form.errors.role}
              >
                {USER_ROLES.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1} className="form-actions">
                <Button component={Link} to="/users" variant="outlined" color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={form.isSubmitting}>
                  {form.isSubmitting ? 'Saving…' : 'Save user'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserFormPage;
