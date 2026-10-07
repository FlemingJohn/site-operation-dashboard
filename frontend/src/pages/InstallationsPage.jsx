import { useEffect, useState } from 'react';
import { Alert, Card, LinearProgress, Stack, TablePagination } from '@mui/material';
import { deleteInstallation, getInstallations } from '../api/installationApi';
import { getSites } from '../api/siteApi';
import DeleteDialog from '../components/DeleteDialog';
import ErrorAlert from '../components/ErrorAlert';
import FilterSelect from '../components/FilterSelect';
import InstallationTable from '../components/InstallationTable';
import SearchField from '../components/SearchField';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { INSTALLATION_STATUSES, MAX_SITE_OPTIONS } from '../constants';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { siteId: '', status: '' };
const SITE_OPTIONS_ERROR = "Couldn't load sites for filtering.";

const InstallationsPage = () => {
  const [siteOptions, setSiteOptions] = useState([]);
  const [siteOptionsError, setSiteOptionsError] = useState('');
  const installations = usePaginatedList(getInstallations, INITIAL_FILTERS);
  const flash = useFlashMessage();
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteInstallation,
    onDeleted: () => {
      flash.showMessage('Installation deleted');
      installations.refreshAfterDelete();
    },
  });

  useEffect(() => {
    getSites({ limit: MAX_SITE_OPTIONS })
      .then((result) =>
        setSiteOptions(result.data.map((site) => ({ value: String(site.id), label: site.name })))
      )
      .catch(() => setSiteOptionsError(SITE_OPTIONS_ERROR));
  }, []);

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <SearchField
          value={installations.searchInput}
          onChange={installations.setSearchInput}
          placeholder="Search equipment or technician"
          label="Search installations"
        />
        <FilterSelect
          label="Site"
          allLabel="All sites"
          value={installations.filters.siteId}
          options={siteOptions}
          onChange={(value) => installations.updateFilter('siteId', value)}
        />
        <FilterSelect
          label="Status"
          allLabel="All statuses"
          value={installations.filters.status}
          options={INSTALLATION_STATUSES}
          onChange={(value) => installations.updateFilter('status', value)}
        />
      </Stack>

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
