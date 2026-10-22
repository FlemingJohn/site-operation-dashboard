import { Card, LinearProgress } from '@mui/material';
import { deleteSite, getSiteCounts, getSites } from '../api/siteApi';
import CardGrid from '../components/CardGrid';
import ErrorAlert from '../components/ErrorAlert';
import ListPagination from '../components/ListPagination';
import ListToolbar from '../components/ListToolbar';
import PageIntro from '../components/PageIntro';
import SiteCard from '../components/SiteCard';
import SiteDeleteDialog from '../components/SiteDeleteDialog';
import SiteTable from '../components/SiteTable';
import SuccessSnackbar from '../components/SuccessSnackbar';
import SummaryStrip from '../components/SummaryStrip';
import ViewToggle from '../components/ViewToggle';
import {
  LIST_PAGE_SIZE_OPTIONS,
  LIST_VIEWS,
  REGIONS,
  SITE_DEFAULT_SORT,
  SITE_STATUSES,
} from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useCounts } from '../hooks/useCounts';
import { useListView } from '../hooks/useListView';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { status: '', region: '' };
const NO_FILTERS = {};
const SITE_FILTERS = [
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

const SitesPage = () => {
  const sites = usePaginatedList(
    getSites,
    INITIAL_FILTERS,
    SITE_DEFAULT_SORT,
    LIST_PAGE_SIZE_OPTIONS
  );
  const counts = useCounts(getSiteCounts, NO_FILTERS, sites.version);
  const [view, setView] = useListView('siteops.sitesView', counts.all);
  const flash = useFlashMessage();
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteSite,
    onDeleted: (site) => {
      flash.showMessage(`${site.name} deleted`);
      sites.refreshAfterDelete();
    },
  });
  const emptyMessage = sites.clearFilters ? 'No sites match these filters.' : 'No sites yet.';

  return (
    <>
      <div className="page-header">
        <PageIntro>
          Every place where equipment is installed. Open a site to see its installations.
        </PageIntro>
        <ViewToggle value={view} onChange={setView} />
      </div>

      <SummaryStrip
        items={[
          { key: '', label: 'All sites', count: counts.all },
          { key: 'active', label: 'Active', count: counts.active },
          { key: 'inactive', label: 'Inactive', count: counts.inactive },
        ]}
        selectedKey={sites.filters.status}
        onSelect={(status) => sites.updateFilter('status', status)}
      />

      <ListToolbar
        search={{
          value: sites.searchInput,
          onChange: sites.setSearchInput,
          placeholder: 'Search by site or city',
          label: 'Search sites',
        }}
        filters={SITE_FILTERS}
        values={sites.filters}
        onFilterChange={sites.updateFilter}
      />

      {sites.error && <ErrorAlert message={sites.error} onRetry={sites.reload} />}

      <Card className={view === LIST_VIEWS.cards ? 'card-list' : undefined}>
        {sites.isLoading && <LinearProgress />}
        {view === LIST_VIEWS.cards ? (
          <CardGrid
            items={sites.rows}
            renderItem={(site) => <SiteCard key={site.id} site={site} />}
            isLoading={sites.isLoading}
            emptyMessage={emptyMessage}
            onClearFilters={sites.clearFilters}
          />
        ) : (
          <SiteTable
            sites={sites.rows}
            isLoading={sites.isLoading}
            emptyMessage={emptyMessage}
            onClearFilters={sites.clearFilters}
            onDelete={deletion.open}
            {...sites.sortProps}
          />
        )}
        <ListPagination label="Per page:" {...sites.paginationProps} />
      </Card>

      <SiteDeleteDialog site={deletion.item} {...deletion.dialogProps} />

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default SitesPage;
