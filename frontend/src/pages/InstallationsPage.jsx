import { Alert, Card, LinearProgress } from '@mui/material';
import {
  deleteInstallation,
  getInstallationCounts,
  getInstallations,
} from '../api/installationApi';
import DeleteDialog from '../components/DeleteDialog';
import ErrorAlert from '../components/ErrorAlert';
import InstallationTable from '../components/InstallationTable';
import ListPagination from '../components/ListPagination';
import ListToolbar from '../components/ListToolbar';
import PageIntro from '../components/PageIntro';
import StatusTabs from '../components/StatusTabs';
import SuccessSnackbar from '../components/SuccessSnackbar';
import {
  ALL_STATUSES_TAB,
  INSTALLATION_DEFAULT_SORT,
  INSTALLATION_STATUS_TABS,
} from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useCounts } from '../hooks/useCounts';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useSiteOptions } from '../hooks/useSiteOptions';

const INITIAL_FILTERS = { siteId: '', status: '' };

const InstallationsPage = () => {
  const siteOptions = useSiteOptions();
  const installations = usePaginatedList(
    getInstallations,
    INITIAL_FILTERS,
    INSTALLATION_DEFAULT_SORT
  );
  const { search, siteId, status } = installations.filters;
  const counts = useCounts(getInstallationCounts, { search, siteId }, installations.version);
  const flash = useFlashMessage();
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteInstallation,
    onDeleted: () => {
      flash.showMessage('Installation deleted');
      installations.refreshAfterDelete();
    },
  });

  return (
    <>
      <PageIntro>
        Equipment installed at your sites. Use the tabs to see what is pending, in progress or done.
      </PageIntro>

      <StatusTabs
        label="Show installations by status"
        tabs={INSTALLATION_STATUS_TABS.map((tab) => ({ ...tab, count: counts[tab.value] }))}
        value={status || ALL_STATUSES_TAB}
        onChange={(tab) =>
          installations.updateFilter('status', tab === ALL_STATUSES_TAB ? '' : tab)
        }
      />

      <ListToolbar
        search={{
          value: installations.searchInput,
          onChange: installations.setSearchInput,
          placeholder: 'Search equipment or technician',
          label: 'Search installations',
        }}
        filters={[
          {
            name: 'siteId',
            label: 'Site',
            allLabel: 'All sites',
            options: siteOptions.options,
            icon: FIELD_ICONS.site,
            searchable: true,
          },
        ]}
        values={installations.filters}
        onFilterChange={installations.updateFilter}
      />

      {siteOptions.error && <Alert severity="warning">{siteOptions.error}</Alert>}
      {installations.error && (
        <ErrorAlert message={installations.error} onRetry={installations.reload} />
      )}

      <Card>
        {installations.isLoading && <LinearProgress />}
        <InstallationTable
          installations={installations.rows}
          isLoading={installations.isLoading}
          emptyMessage={
            installations.clearFilters
              ? 'No installations match these filters.'
              : 'No installations yet.'
          }
          onClearFilters={installations.clearFilters}
          onDelete={deletion.open}
          {...installations.sortProps}
        />
        <ListPagination {...installations.paginationProps} />
      </Card>

      <DeleteDialog
        {...deletion.dialogProps}
        title="Delete installation?"
        message={
          deletion.item &&
          `${deletion.item.equipment} at ${deletion.item.siteName} will be permanently deleted.`
        }
      />

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default InstallationsPage;
