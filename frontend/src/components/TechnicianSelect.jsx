import { MenuItem, TextField } from '@mui/material';
import { useTechnicians } from '../hooks/useTechnicians';

const TechnicianSelect = ({ id, label, value, onChange }) => {
  const { technicians, error } = useTechnicians();

  return (
    <TextField
      id={id}
      select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      helperText={error}
      error={Boolean(error)}
    >
      {technicians.map((technician) => (
        <MenuItem key={technician.id} value={technician.fullName}>
          {technician.fullName}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default TechnicianSelect;
