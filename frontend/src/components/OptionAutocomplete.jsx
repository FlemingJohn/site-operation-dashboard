import { Autocomplete, TextField } from '@mui/material';
import FieldIcon from './FieldIcon';

const OptionAutocomplete = ({
  id,
  label,
  options,
  value,
  onChange,
  icon,
  placeholder,
  required,
  error,
  helperText,
  size,
}) => (
  <Autocomplete
    id={id}
    options={options}
    value={options.find((option) => option.value === value) ?? null}
    onChange={(event, option) => onChange(option?.value ?? '')}
    isOptionEqualToValue={(option, selected) => option.value === selected.value}
    size={size}
    fullWidth
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        placeholder={placeholder}
        required={required}
        error={error}
        helperText={helperText}
        slotProps={{
          ...params.slotProps,
          input: { ...params.slotProps.input, startAdornment: <FieldIcon icon={icon} /> },
        }}
      />
    )}
  />
);

export default OptionAutocomplete;
