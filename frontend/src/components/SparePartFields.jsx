import { Grid, TextField } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import ShelvesIcon from '@mui/icons-material/Shelves';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import FieldIcon from './FieldIcon';

const MAX_NAME_LENGTH = 120;

const COUNT_FIELDS = [
  {
    name: 'stock',
    label: 'In stock now',
    icon: NumbersOutlinedIcon,
    hint: 'How many are on the shelf today',
  },
  {
    name: 'reorderAt',
    label: 'Reorder at',
    icon: TrendingDownOutlinedIcon,
    hint: 'At or below this, the part shows Running low',
  },
  {
    name: 'capacity',
    label: 'Shelf capacity',
    icon: ShelvesIcon,
    hint: 'The full mark of the stock meter',
  },
];

const SparePartFields = ({ form }) => (
  <>
    <Grid size={12}>
      <TextField
        id="part-name"
        name="name"
        label="Part name"
        placeholder="Winch drum bearing"
        fullWidth
        required
        value={form.values.name}
        onChange={form.handleChange}
        error={Boolean(form.errors.name)}
        helperText={form.errors.name}
        slotProps={{
          input: { startAdornment: <FieldIcon icon={Inventory2OutlinedIcon} /> },
          htmlInput: { maxLength: MAX_NAME_LENGTH },
        }}
      />
    </Grid>
    {COUNT_FIELDS.map((field) => (
      <Grid key={field.name} size={{ xs: 12, sm: 4 }}>
        <TextField
          id={`part-${field.name}`}
          name={field.name}
          label={field.label}
          type="number"
          fullWidth
          required
          value={form.values[field.name]}
          onChange={form.handleChange}
          error={Boolean(form.errors[field.name])}
          helperText={form.errors[field.name] ?? field.hint}
          slotProps={{
            input: { startAdornment: <FieldIcon icon={field.icon} /> },
            htmlInput: { min: 0, step: 1, inputMode: 'numeric' },
          }}
        />
      </Grid>
    ))}
  </>
);

export default SparePartFields;
