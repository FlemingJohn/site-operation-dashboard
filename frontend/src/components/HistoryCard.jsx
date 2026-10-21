import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardHeader, LinearProgress } from '@mui/material';
import { getActivity } from '../api/activityApi';
import { ACTIVITY_DEFAULT_SORT } from '../constants';
import { usePaginatedList } from '../hooks/usePaginatedList';
import ActivityList from './ActivityList';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import ListPagination from './ListPagination';

const HISTORY_PAGE_SIZE_OPTIONS = [5, 10, 20];

const HistoryCard = ({ path }) => {
  const history = usePaginatedList(
    getActivity,
    { path },
    ACTIVITY_DEFAULT_SORT,
    HISTORY_PAGE_SIZE_OPTIONS
  );

  return (
    <Card>
      <CardHeader
        title="History"
        subheader="Who changed what here"
        action={
          <Button component={RouterLink} to="/activity" size="small">
            All activity
          </Button>
        }
      />
      {history.isLoading && <LinearProgress />}
      {history.error && <ErrorAlert message={history.error} onRetry={history.reload} />}
      {!history.isLoading && history.rows.length === 0 ? (
        <EmptyState title="Nothing has changed here yet." />
      ) : (
        <ActivityList events={history.rows} />
      )}
      {history.total > HISTORY_PAGE_SIZE_OPTIONS[0] && (
        <ListPagination {...history.paginationProps} />
      )}
    </Card>
  );
};

export default HistoryCard;
