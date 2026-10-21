import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { LIST_VIEWS } from '../constants';

const VIEW_OPTIONS = [
  { value: LIST_VIEWS.cards, label: 'Cards', icon: GridViewOutlinedIcon },
  { value: LIST_VIEWS.table, label: 'Table', icon: ViewListOutlinedIcon },
];

const ViewToggle = ({ value, onChange }) => (
  <ToggleButtonGroup
    exclusive
    size="small"
    value={value}
    onChange={(event, nextView) => nextView && onChange(nextView)}
    aria-label="Choose how to show the list"
    className="view-toggle"
  >
    {VIEW_OPTIONS.map(({ value: option, label, icon: Icon }) => (
      <ToggleButton key={option} value={option} aria-label={label}>
        <Icon fontSize="small" />
        <span className="view-toggle-label">{label}</span>
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

export default ViewToggle;
