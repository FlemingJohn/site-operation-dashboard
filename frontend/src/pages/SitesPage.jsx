import { Card, LinearProgress, TablePagination } from '@mui/material';
import { deleteSite, getSites } from '../api/siteApi';
import ErrorAlert from '../components/ErrorAlert';
import ListToolbar from '../components/ListToolbar';
import SiteDeleteDialog from '../components/SiteDeleteDialog';
import SiteTable from '../components/SiteTable';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { REGIONS, SITE_DEFAULT_SORT, SITE_STATUSES } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { status: '', region: '' };

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
  const sites = usePaginatedList(getSites, INITIAL_FILTERS, SITE_DEFAULT_SORT);
  const flash = useFlashMessage();
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteSite,
    onDeleted: (site) => {
      flash.showMessage(`${site.name} deleted`);
      sites.refreshAfterDelete();
    },
  });

  return (
    <>
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

      <Card>
        {sites.isLoading && <LinearProgress />}
        <SiteTable
          sites={sites.rows}
          isLoading={sites.isLoading}
          emptyMessage={sites.clearFilters ? 'No sites match these filters.' : 'No sites yet.'}
          onClearFilters={sites.clearFilters}
          onDelete={deletion.open}
          {...sites.sortProps}
        />
        <TablePagination component="div" {...sites.paginationProps} />
      </Card>

      <SiteDeleteDialog site={deletion.item} {...deletion.dialogProps} />

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default SitesPage;
