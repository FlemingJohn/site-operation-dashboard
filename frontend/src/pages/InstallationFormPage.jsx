import { useEffect, useState } from 'react';
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
import { createInstallation, getInstallation, updateInstallation } from '../api/installationApi';
import { getSites } from '../api/siteApi';
import { getTechnicians } from '../api/userApi';
import ErrorAlert from '../components/ErrorAlert';
import { INSTALLATION_STATUSES, MAX_SELECT_OPTIONS } from '../constants';
import { useEntityForm } from '../hooks/useEntityForm';
import { getToday } from '../utils';
import { installationSchema } from '../validation/installationSchema';

const MAX_EQUIPMENT_LENGTH = 150;

const toFormValues = (installation) => ({
  equipment: installation.equipment,
  siteId: String(installation.siteId),
  technicianId: installation.technicianId ? String(installation.technicianId) : '',
  installedOn: installation.installedOn.slice(0, 10),
  status: installation.status,
});

const saveInstallation = (installation, id, idempotencyKey) =>
  id ? updateInstallation(id, installation) : createInstallation(installation, idempotencyKey);

const InstallationFormPage = () => {
  const { id } = useParams();
  const [sites, setSites] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [optionsError, setOptionsError] = useState('');

  const form = useEntityForm({
    id,
    emptyValues: {
      equipment: '',
      siteId: '',
      technicianId: '',
      installedOn: getToday(),
      status: 'pending',
    },
    load: getInstallation,
    toFormValues,
    schema: installationSchema,
    save: saveInstallation,
    entityName: 'Installation',
    successPath: '/installations',
  });

  useEffect(() => {
    Promise.all([getSites({ limit: MAX_SELECT_OPTIONS }), getTechnicians()])
      .then(([siteResult, technicianList]) => {
        setSites(siteResult.data);
        setTechnicians(technicianList);
      })
      .catch((err) => setOptionsError(err.message));
  }, []);

  const loadError = form.loadError || optionsError;
  if (loadError) {
    return (
      <ErrorAlert message={loadError} backTo="/installations" backLabel="Back to installations" />
    );
  }
  if (form.isLoading) return <LinearProgress />;

  const submitLabel = form.isEditing ? 'Update installation' : 'Save installation';

  return (
    <Card className="form-card">
      <CardHeader
        title={form.isEditing ? 'Edit installation' : 'Add installation'}
        subheader={
          form.isEditing ? 'Update the installation record' : 'Record equipment installed at a site'
        }
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
                id="installation-equipment"
                name="equipment"
                label="Equipment"
                fullWidth
                required
                value={form.values.equipment}
                onChange={form.handleChange}
                error={Boolean(form.errors.equipment)}
                helperText={form.errors.equipment}
                slotProps={{ htmlInput: { maxLength: MAX_EQUIPMENT_LENGTH } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="installation-site"
                name="siteId"
                label="Site"
                select
                fullWidth
                required
                value={sites.length > 0 ? form.values.siteId : ''}
                onChange={form.handleChange}
                error={Boolean(form.errors.siteId)}
                helperText={form.errors.siteId}
              >
                {sites.map((site) => (
                  <MenuItem key={site.id} value={String(site.id)}>
                    {site.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="installation-technician"
                name="technicianId"
                label="Technician"
                select
                fullWidth
                value={technicians.length > 0 ? form.values.technicianId : ''}
                onChange={form.handleChange}
                error={Boolean(form.errors.technicianId)}
                helperText={form.errors.technicianId}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {technicians.map((technician) => (
                  <MenuItem key={technician.id} value={String(technician.id)}>
                    {technician.fullName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="installation-date"
                name="installedOn"
                label="Installation date"
                type="date"
                fullWidth
                required
                value={form.values.installedOn}
                onChange={form.handleChange}
                error={Boolean(form.errors.installedOn)}
                helperText={form.errors.installedOn}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="installation-status"
                name="status"
                label="Status"
                select
                fullWidth
                value={form.values.status}
                onChange={form.handleChange}
                error={Boolean(form.errors.status)}
                helperText={form.errors.status}
              >
                {INSTALLATION_STATUSES.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1} className="form-actions">
                <Button component={Link} to="/installations" variant="outlined" color="inherit">
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

export default InstallationFormPage;
