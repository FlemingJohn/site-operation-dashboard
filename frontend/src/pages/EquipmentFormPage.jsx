import { useParams } from 'react-router-dom';
import { Alert, Card, CardContent, CardHeader, Grid, LinearProgress } from '@mui/material';
import { createEquipment, getEquipmentUnit, updateEquipment } from '../api/equipmentApi';
import EquipmentFields from '../components/EquipmentFields';
import ErrorAlert from '../components/ErrorAlert';
import FormActions from '../components/FormActions';
import { SERVICE_INTERVAL_DAYS } from '../constants';
import { useEntityForm } from '../hooks/useEntityForm';
import { useSiteOptions } from '../hooks/useSiteOptions';
import { addDays } from '../lib/addDays';
import { getToday } from '../utils';
import { equipmentSchema } from '../validation/equipmentSchema';

const toFormValues = (unit) => ({
  serial: unit.serial,
  type: unit.type,
  status: unit.status,
  siteId: unit.siteId ? String(unit.siteId) : '',
  nextServiceOn: unit.nextServiceOn.slice(0, 10),
});

const saveEquipment = (machine, id, idempotencyKey) =>
  id ? updateEquipment(id, machine) : createEquipment(machine, idempotencyKey);

const EquipmentFormPage = () => {
  const { id } = useParams();
  const sites = useSiteOptions();
  const form = useEntityForm({
    id,
    emptyValues: {
      serial: '',
      type: '',
      status: 'in_stock',
      siteId: '',
      nextServiceOn: addDays(getToday(), SERVICE_INTERVAL_DAYS),
    },
    load: getEquipmentUnit,
    toFormValues,
    schema: equipmentSchema,
    save: saveEquipment,
    entityName: 'Machine',
    successPath: '/equipment',
  });

  const loadError = form.loadError || sites.error;
  if (loadError) {
    return <ErrorAlert message={loadError} backTo="/equipment" backLabel="Back to equipment" />;
  }
  if (form.isLoading) return <LinearProgress />;

  return (
    <Card className="form-card">
      <CardHeader
        title={form.isEditing ? 'Edit machine' : 'Add machine'}
        subheader={
          form.isEditing ? 'Update the machine details' : 'Register a machine and where it is'
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
            <EquipmentFields form={form} siteOptions={sites.options} />
            <FormActions
              cancelPath={id ? `/equipment/${id}` : '/equipment'}
              submitLabel={form.isEditing ? 'Update machine' : 'Save machine'}
              isSubmitting={form.isSubmitting}
            />
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentFormPage;
