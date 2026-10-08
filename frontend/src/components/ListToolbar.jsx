import { useState } from 'react';
import {
  Badge,
  Button,
  Chip,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterSelect from './FilterSelect';
import OptionAutocomplete from './OptionAutocomplete';
import SearchField from './SearchField';

const getOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value;

const ListToolbar = ({ search, filters, values, onFilterChange }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const activeFilters = filters.filter(({ name }) => values[name]);

  const clearAll = () => filters.forEach(({ name }) => onFilterChange(name, ''));

  const filterButton = (
    <Tooltip title="Filters">
      <IconButton
        size="small"
        edge="end"
        aria-label="Filters"
        aria-haspopup="true"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        <Badge badgeContent={activeFilters.length} color="primary">
          <FilterListIcon fontSize="small" />
        </Badge>
      </IconButton>
    </Tooltip>
  );

  return (
    <Stack spacing={1}>
      <SearchField {...search} action={filterButton} />

      {activeFilters.length > 0 && (
        <Stack direction="row" className="filter-chips">
          {activeFilters.map(({ name, label, options }) => (
            <Chip
              key={name}
              variant="outlined"
              label={`${label}: ${getOptionLabel(options, values[name])}`}
              onDelete={() => onFilterChange(name, '')}
            />
          ))}
        </Stack>
      )}

      <Popover
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { className: 'filter-menu' } }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle2">Filters</Typography>
          {filters.map(({ name, label, allLabel, options, icon, searchable }) => {
            const FilterField = searchable ? OptionAutocomplete : FilterSelect;
            return (
              <FilterField
                key={name}
                id={`filter-${name}`}
                label={label}
                allLabel={allLabel}
                placeholder={allLabel}
                icon={icon}
                size="small"
                value={values[name]}
                options={options}
                onChange={(value) => onFilterChange(name, value)}
              />
            );
          })}
          <Stack direction="row" className="form-actions">
            <Button size="small" onClick={clearAll} disabled={activeFilters.length === 0}>
              Clear all
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Stack>
  );
};

export default ListToolbar;
