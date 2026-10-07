import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { createSite, getSite, updateSite } from '../api/siteApi';
import ErrorAlert from '../components/ErrorAlert';
import { REGIONS, SITE_STATUSES } from '../constants';
import { useEntityForm } from '../hooks/useEntityForm';
import { siteSchema } from '../validation/siteSchema';

const EMPTY_SITE = { name: '', city: '', region: '', status: 'active' };
const MAX_NAME_LENGTH = 150;
const MAX_CITY_LENGTH = 100;

const toFormValues = ({ name, city, region, status }) => ({ name, city, region, status });

const saveSite = (site, id, idempotencyKey) =>
  id ? updateSite(id, site) : createSite(site, idempotencyKey);

const SiteFormPage = () => {
  const { id } = useParams();
  const form = useEntityForm({
    id,
    emptyValues: EMPTY_SITE,
    load: getSite,
    toFormValues,
    schema: siteSchema,
    save: saveSite,
    entityName: 'Site',
    successPath: '/sites',
  });

  if (form.loadError) {
    return <ErrorAlert message={form.loadError} backTo="/sites" backLabel="Back to sites" />;
  }
  if (form.isLoading) return <LinearProgress />;

  const submitLabel = form.isEditing ? 'Update site' : 'Save site';

  return (
    <Card className="form-card">
      <CardHeader
        title={form.isEditing ? 'Edit site' : 'Add site'}
        subheader={form.isEditing ? 'Update the site details' : 'Register a new operational site'}
      />
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
                id="site-name"
                name="name"
                label="Site name"
                fullWidth
                required
                value={form.values.name}
                onChange={form.handleChange}
                error={Boolean(form.errors.name)}
                helperText={form.errors.name}
                slotProps={{ htmlInput: { maxLength: MAX_NAME_LENGTH } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="site-city"
                name="city"
                label="City"
                fullWidth
                required
                value={form.values.city}
                onChange={form.handleChange}
                error={Boolean(form.errors.city)}
                helperText={form.errors.city}
                slotProps={{ htmlInput: { maxLength: MAX_CITY_LENGTH } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="site-region"
                name="region"
                label="Region"
                select
                fullWidth
                required
                value={form.values.region}
                onChange={form.handleChange}
                error={Boolean(form.errors.region)}
                helperText={form.errors.region}
              >
                {REGIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="site-status"
                name="status"
                label="Status"
                select
                fullWidth
                value={form.values.status}
                onChange={form.handleChange}
                error={Boolean(form.errors.status)}
                helperText={form.errors.status}
              >
                {SITE_STATUSES.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1} className="form-actions">
                <Button component={Link} to="/sites" variant="outlined" color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={form.isSubmitting}>
                  {form.isSubmitting ? 'Saving…' : submitLabel}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default SiteFormPage;
