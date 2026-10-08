import { MenuItem, TextField } from '@mui/material';
import FieldIcon from './FieldIcon';

const FilterSelect = ({ id, label, allLabel, value, options, icon, onChange }) => (
  <TextField
    id={id}
    select
    fullWidth
    size="small"
    label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{ input: { startAdornment: <FieldIcon icon={icon} /> } }}
  >
    <MenuItem value="">{allLabel}</MenuItem>
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

export default FilterSelect;
