import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardHeader, LinearProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getInstallations } from '../api/installationApi';
import { deleteSite, getSite } from '../api/siteApi';
import ErrorAlert from '../components/ErrorAlert';
import HistoryCard from '../components/HistoryCard';
import InstallationTable from '../components/InstallationTable';
import ListPagination from '../components/ListPagination';
import SiteDeleteDialog from '../components/SiteDeleteDialog';
import SiteDetailHeader from '../components/SiteDetailHeader';
import SummaryStrip from '../components/SummaryStrip';
import {
  INSTALLATION_COUNT_QUERIES,
  INSTALLATION_DEFAULT_SORT,
  INSTALLATION_STATUS_TABS,
} from '../constants';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useListCounts } from '../hooks/useListCounts';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useRecord } from '../hooks/useRecord';

const SiteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const site = useRecord(getSite, id);
  const installations = usePaginatedList(
    getInstallations,
    { siteId: id },
    INSTALLATION_DEFAULT_SORT
  );
  const counts = useListCounts(
    getInstallations,
    INSTALLATION_COUNT_QUERIES,
    { siteId: id },
    installations.version
  );
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteSite,
    onDeleted: (deleted) => navigate('/sites', { state: { message: `${deleted.name} deleted` } }),
  });

  if (site.error)
    return <ErrorAlert message={site.error} backTo="/sites" backLabel="Back to sites" />;
  if (site.isLoading) return <LinearProgress />;

  return (
    <>
      <SiteDetailHeader site={site.record} onDelete={() => deletion.open(site.record)} />

      <SummaryStrip
        items={INSTALLATION_STATUS_TABS.map(({ value, label }) => ({
          key: value,
          label: value === 'all' ? 'Installations' : label,
          count: counts[value],
        }))}
      />

      <Card>
        <CardHeader
          title="Installations at this site"
          subheader="Newest first"
          action={
            <Button
              component={RouterLink}
              to={`/installations/new?siteId=${id}`}
              startIcon={<AddIcon />}
            >
              Add installation here
            </Button>
          }
        />
        {installations.isLoading && <LinearProgress />}
        <InstallationTable
          installations={installations.rows}
          isLoading={installations.isLoading}
          emptyMessage="No installations at this site yet."
          showSite={false}
          {...installations.sortProps}
        />
        <ListPagination {...installations.paginationProps} />
      </Card>

      <HistoryCard path={`/sites/${id}`} />

      <SiteDeleteDialog site={deletion.item} {...deletion.dialogProps} />
    </>
  );
};

export default SiteDetailPage;
