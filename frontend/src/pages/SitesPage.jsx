import { Card, LinearProgress, Stack, TablePagination } from '@mui/material';
import { deleteSite, getSites } from '../api/siteApi';
import DeleteDialog from '../components/DeleteDialog';
import ErrorAlert from '../components/ErrorAlert';
import FilterSelect from '../components/FilterSelect';
import SearchField from '../components/SearchField';
import SiteTable from '../components/SiteTable';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { REGIONS, SITE_DEFAULT_SORT, SITE_STATUSES } from '../constants';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { status: '', region: '' };

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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <SearchField
          value={sites.searchInput}
          onChange={sites.setSearchInput}
          placeholder="Search by site or city"
          label="Search sites"
        />
        <FilterSelect
          label="Status"
          allLabel="All statuses"
          value={sites.filters.status}
          options={SITE_STATUSES}
          onChange={(value) => sites.updateFilter('status', value)}
        />
        <FilterSelect
          label="Region"
          allLabel="All regions"
          value={sites.filters.region}
          options={REGIONS}
          onChange={(value) => sites.updateFilter('region', value)}
        />
      </Stack>

      {sites.error && <ErrorAlert message={sites.error} onRetry={sites.reload} />}

      <Card>
        {sites.isLoading && <LinearProgress />}
        <SiteTable
          sites={sites.rows}
          isLoading={sites.isLoading}
          emptyMessage="No sites match these filters."
          onDelete={deletion.open}
          {...sites.sortProps}
        />
        <TablePagination component="div" {...sites.paginationProps} />
      </Card>

      <DeleteDialog
        {...deletion.dialogProps}
        title="Delete site?"
        message={
          deletion.item &&
          `${deletion.item.name} and its ${deletion.item.installationCount} installation records will be permanently deleted.`
        }
      />

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default SitesPage;
