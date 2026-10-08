import { useEffect, useState } from 'react';
import { Alert, Card, LinearProgress, TablePagination } from '@mui/material';
import { deleteInstallation, getInstallations } from '../api/installationApi';
import { getSites } from '../api/siteApi';
import DeleteDialog from '../components/DeleteDialog';
import ErrorAlert from '../components/ErrorAlert';
import InstallationTable from '../components/InstallationTable';
import ListToolbar from '../components/ListToolbar';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { INSTALLATION_DEFAULT_SORT, INSTALLATION_STATUSES, MAX_SELECT_OPTIONS } from '../constants';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { siteId: '', status: '' };
const SITE_OPTIONS_ERROR = "Couldn't load sites for filtering.";

const InstallationsPage = () => {
  const [siteOptions, setSiteOptions] = useState([]);
  const [siteOptionsError, setSiteOptionsError] = useState('');
  const installations = usePaginatedList(
    getInstallations,
    INITIAL_FILTERS,
    INSTALLATION_DEFAULT_SORT
  );
  const flash = useFlashMessage();
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteInstallation,
    onDeleted: () => {
      flash.showMessage('Installation deleted');
      installations.refreshAfterDelete();
    },
  });

  useEffect(() => {
    getSites({ limit: MAX_SELECT_OPTIONS })
      .then((result) =>
        setSiteOptions(result.data.map((site) => ({ value: String(site.id), label: site.name })))
      )
      .catch(() => setSiteOptionsError(SITE_OPTIONS_ERROR));
  }, []);

  return (
    <>
      <ListToolbar
        search={{
          value: installations.searchInput,
          onChange: installations.setSearchInput,
          placeholder: 'Search equipment or technician',
          label: 'Search installations',
        }}
        filters={[
          { name: 'siteId', label: 'Site', allLabel: 'All sites', options: siteOptions },
          {
            name: 'status',
            label: 'Status',
            allLabel: 'All statuses',
            options: INSTALLATION_STATUSES,
          },
        ]}
        values={installations.filters}
        onFilterChange={installations.updateFilter}
      />

      {siteOptionsError && <Alert severity="warning">{siteOptionsError}</Alert>}
      {installations.error && (
        <ErrorAlert message={installations.error} onRetry={installations.reload} />
      )}

      <Card>
        {installations.isLoading && <LinearProgress />}
        <InstallationTable
          installations={installations.rows}
          isLoading={installations.isLoading}
          emptyMessage="No installations match these filters."
          onDelete={deletion.open}
          {...installations.sortProps}
        />
        <TablePagination component="div" {...installations.paginationProps} />
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
