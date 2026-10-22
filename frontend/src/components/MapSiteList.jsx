import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { STATE_ICONS } from '../stateIcons';
import CardIcon from './CardIcon';
import EmptyState from './EmptyState';
import StatusChip from './StatusChip';

const MapSiteList = ({ sites, selectedId, onSelect, onClearFilters }) => {
  if (sites.length === 0) {
    return (
      <EmptyState
        title="No sites match these filters."
        actionLabel="Clear filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <List dense className="map-site-list">
      {sites.map((site) => (
        <ListItemButton
          key={site.id}
          divider
          selected={site.id === selectedId}
          onClick={() => onSelect(site.id)}
        >
          <ListItemIcon>
            <CardIcon {...STATE_ICONS.sites[site.status]} />
          </ListItemIcon>
          <ListItemText primary={site.name} secondary={`${site.region} · ${site.city}`} />
          <StatusChip status={site.status} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default MapSiteList;
