import { InputAdornment } from '@mui/material';

const FieldIcon = ({ icon: Icon }) => (
  <InputAdornment position="start">
    <Icon fontSize="small" className="field-icon" />
  </InputAdornment>
);

export default FieldIcon;
