import { useState } from 'react';
import { Card, CardHeader, LinearProgress } from '@mui/material';
import { getSites } from '../api/siteApi';
import ErrorAlert from '../components/ErrorAlert';
import ListToolbar from '../components/ListToolbar';
import MapSiteList from '../components/MapSiteList';
import SiteMap from '../components/SiteMap';
import { MAX_SELECT_OPTIONS, REGIONS, SITE_DEFAULT_SORT, SITE_STATUSES } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { getSiteCoordinates } from '../lib/getSiteCoordinates';
import { pluralize } from '../lib/pluralize';

const INITIAL_FILTERS = { status: '', region: '' };
const MAP_PAGE_SIZE_OPTIONS = [MAX_SELECT_OPTIONS];

const MAP_FILTERS = [
  {
    name: 'status',
    label: 'Status',
    allLabel: 'All statuses',
    options: SITE_STATUSES,
    icon: FIELD_ICONS.status,
  },
  {
    name: 'region',
    label: 'Region',
    allLabel: 'All regions',
    options: REGIONS,
    icon: FIELD_ICONS.region,
  },
];

const describeCount = (shown, total) =>
  shown < total ? `Showing the first ${shown} of ${total} sites` : pluralize(total, 'site');

const MapPage = () => {
  const sites = usePaginatedList(
    getSites,
    INITIAL_FILTERS,
    SITE_DEFAULT_SORT,
    MAP_PAGE_SIZE_OPTIONS
  );
  const [selectedId, setSelectedId] = useState(null);
  const placedSites = sites.rows.map((site) => ({
    ...site,
    coordinates: getSiteCoordinates(site),
  }));

  return (
    <>
      <ListToolbar
        search={{
          value: sites.searchInput,
          onChange: sites.setSearchInput,
          placeholder: 'Search by site or city',
          label: 'Search the map',
        }}
        filters={MAP_FILTERS}
        values={sites.filters}
        onFilterChange={sites.updateFilter}
      />

      {sites.error && <ErrorAlert message={sites.error} onRetry={sites.reload} />}

      <div className="map-layout">
        <Card className="map-list-card">
          <CardHeader title="Sites" subheader={describeCount(sites.rows.length, sites.total)} />
          {sites.isLoading && <LinearProgress />}
          {!sites.isLoading && (
            <MapSiteList
              sites={placedSites}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onClearFilters={sites.clearFilters}
            />
          )}
        </Card>
        <Card className="map-card">
          <SiteMap sites={placedSites} selectedId={selectedId} onSelect={setSelectedId} />
        </Card>
      </div>
    </>
  );
};

export default MapPage;
