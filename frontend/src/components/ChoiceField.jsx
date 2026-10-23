import { MenuItem, TextField } from '@mui/material';
import FieldIcon from './FieldIcon';

const ChoiceField = ({ id, name, label, options, icon, form, onChange }) => (
  <TextField
    id={id}
    name={name}
    label={label}
    select
    fullWidth
    required
    value={form.values[name]}
    onChange={onChange ?? form.handleChange}
    error={Boolean(form.errors[name])}
    helperText={form.errors[name]}
    slotProps={{ input: { startAdornment: <FieldIcon icon={icon} /> } }}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

export default ChoiceField;
