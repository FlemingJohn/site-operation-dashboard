import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchField = ({ value, onChange, placeholder, label }) => (
  <TextField
    className="toolbar-search"
    size="small"
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      },
      htmlInput: { 'aria-label': label },
    }}
  />
);

export default SearchField;
