import { MenuItem, TextField } from '@mui/material';

const FilterSelect = ({ label, allLabel, value, options, onChange }) => (
  <TextField
    select
    fullWidth
    size="small"
    label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
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
