import { Grid, TextField } from '@mui/material';
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import ChoiceField from './ChoiceField';
import FieldIcon from './FieldIcon';
import OptionAutocomplete from './OptionAutocomplete';

const MAX_SERIAL_LENGTH = 40;
const IN_STOCK_HINT = 'Machines in stock are in the warehouse, not at a site.';

const EquipmentFields = ({ form, siteOptions }) => {
  const isInStock = form.values.status === 'in_stock';

  const handleStatusChange = (event) => {
    form.handleChange(event);
    if (event.target.value === 'in_stock') form.setFieldValue('siteId', '');
  };

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          id="equipment-serial"
          name="serial"
          label="Serial number"
          placeholder="BY-208"
          fullWidth
          required
          value={form.values.serial}
          onChange={form.handleChange}
          error={Boolean(form.errors.serial)}
          helperText={form.errors.serial}
          slotProps={{
            input: { startAdornment: <FieldIcon icon={FIELD_ICONS.equipment} /> },
            htmlInput: { maxLength: MAX_SERIAL_LENGTH },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ChoiceField
          id="equipment-type"
          name="type"
          label="Type"
          options={EQUIPMENT_TYPES}
          icon={FIELD_ICONS.type}
          form={form}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ChoiceField
          id="equipment-status"
          name="status"
          label="Status"
          options={EQUIPMENT_STATUSES}
          icon={FIELD_ICONS.status}
          form={form}
          onChange={handleStatusChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <OptionAutocomplete
          id="equipment-site"
          label="Site"
          required={!isInStock}
          disabled={isInStock}
          options={siteOptions}
          value={form.values.siteId}
          onChange={(value) => form.setFieldValue('siteId', value)}
          icon={FIELD_ICONS.site}
          placeholder={isInStock ? 'In the warehouse' : 'Type a site name'}
          error={Boolean(form.errors.siteId)}
          helperText={form.errors.siteId ?? (isInStock ? IN_STOCK_HINT : undefined)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          id="equipment-next-service"
          name="nextServiceOn"
          label="Next check-up"
          type="date"
          fullWidth
          required
          value={form.values.nextServiceOn}
          onChange={form.handleChange}
          error={Boolean(form.errors.nextServiceOn)}
          helperText={form.errors.nextServiceOn}
          slotProps={{
            input: { startAdornment: <FieldIcon icon={FIELD_ICONS.service} /> },
            inputLabel: { shrink: true },
          }}
        />
      </Grid>
    </>
  );
};

export default EquipmentFields;
