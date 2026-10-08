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
import FieldIcon from '../components/FieldIcon';
import OptionAutocomplete from '../components/OptionAutocomplete';
import { INSTALLATION_STATUSES, MAX_SELECT_OPTIONS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useEntityForm } from '../hooks/useEntityForm';
import { getToday, toOptions } from '../utils';
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
        setSites(toOptions(siteResult.data, 'name'));
        setTechnicians(toOptions(technicianList, 'fullName'));
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
                slotProps={{
                  input: { startAdornment: <FieldIcon icon={FIELD_ICONS.equipment} /> },
                  htmlInput: { maxLength: MAX_EQUIPMENT_LENGTH },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <OptionAutocomplete
                id="installation-site"
                label="Site"
                required
                options={sites}
                value={form.values.siteId}
                onChange={(value) => form.setFieldValue('siteId', value)}
                icon={FIELD_ICONS.site}
                placeholder="Type a site name"
                error={Boolean(form.errors.siteId)}
                helperText={form.errors.siteId}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <OptionAutocomplete
                id="installation-technician"
                label="Technician"
                options={technicians}
                value={form.values.technicianId}
                onChange={(value) => form.setFieldValue('technicianId', value)}
                icon={FIELD_ICONS.person}
                placeholder="Unassigned"
                error={Boolean(form.errors.technicianId)}
                helperText={form.errors.technicianId}
              />
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
                slotProps={{
                  input: { startAdornment: <FieldIcon icon={FIELD_ICONS.date} /> },
                  inputLabel: { shrink: true },
                }}
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
                slotProps={{ input: { startAdornment: <FieldIcon icon={FIELD_ICONS.status} /> } }}
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
