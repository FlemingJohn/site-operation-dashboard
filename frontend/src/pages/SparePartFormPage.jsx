import { useParams } from 'react-router-dom';
import { Alert, Card, CardContent, CardHeader, Grid, LinearProgress } from '@mui/material';
import { createSparePart, getSparePart, updateSparePart } from '../api/sparePartsApi';
import ErrorAlert from '../components/ErrorAlert';
import FormActions from '../components/FormActions';
import SparePartFields from '../components/SparePartFields';
import { useEntityForm } from '../hooks/useEntityForm';
import { sparePartSchema } from '../validation/sparePartSchema';

const EMPTY_PART = { name: '', stock: '', reorderAt: '', capacity: '' };

const toFormValues = ({ name, stock, reorderAt, capacity }) => ({
  name,
  stock: String(stock),
  reorderAt: String(reorderAt),
  capacity: String(capacity),
});

const savePart = (part, id, idempotencyKey) =>
  id ? updateSparePart(id, part) : createSparePart(part, idempotencyKey);

const SparePartFormPage = () => {
  const { id } = useParams();
  const form = useEntityForm({
    id,
    emptyValues: EMPTY_PART,
    load: getSparePart,
    toFormValues,
    schema: sparePartSchema,
    save: savePart,
    entityName: 'Part',
    successPath: '/spare-parts',
  });

  if (form.loadError) {
    return (
      <ErrorAlert message={form.loadError} backTo="/spare-parts" backLabel="Back to spare parts" />
    );
  }
  if (form.isLoading) return <LinearProgress />;

  return (
    <Card className="form-card">
      <CardHeader
        title={form.isEditing ? 'Edit spare part' : 'Add spare part'}
        subheader={
          form.isEditing ? 'Update the part and its stock levels' : 'Add a part to the store'
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
            <SparePartFields form={form} />
            <FormActions
              cancelPath="/spare-parts"
              submitLabel={form.isEditing ? 'Update part' : 'Save part'}
              isSubmitting={form.isSubmitting}
            />
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default SparePartFormPage;
