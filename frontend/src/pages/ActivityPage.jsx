import { Card, LinearProgress } from '@mui/material';
import { getActivity, getActivityPeople } from '../api/activityApi';
import ActivityList from '../components/ActivityList';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import ListPagination from '../components/ListPagination';
import ListToolbar from '../components/ListToolbar';
import { ACTIVITY_DEFAULT_SORT, ACTIVITY_KINDS, ACTIVITY_PERIODS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useLoader } from '../hooks/useLoader';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { kind: '', actor: '', days: '' };
const ACTIVITY_PAGE_SIZE_OPTIONS = [20, 50, 100];
const NO_PEOPLE = [];

const buildFilters = (people) => [
  {
    name: 'kind',
    label: 'Type',
    allLabel: 'Everything',
    options: ACTIVITY_KINDS,
    icon: FIELD_ICONS.type,
  },
  {
    name: 'actor',
    label: 'Person',
    allLabel: 'Everyone',
    options: people.map((name) => ({ value: name, label: name })),
    icon: FIELD_ICONS.person,
    searchable: true,
  },
  {
    name: 'days',
    label: 'When',
    allLabel: 'Any time',
    options: ACTIVITY_PERIODS,
    icon: FIELD_ICONS.date,
  },
];

const ActivityPage = () => {
  const activity = usePaginatedList(
    getActivity,
    INITIAL_FILTERS,
    ACTIVITY_DEFAULT_SORT,
    ACTIVITY_PAGE_SIZE_OPTIONS
  );
  const people = useLoader(getActivityPeople, NO_PEOPLE);

  return (
    <>
      <ListToolbar
        search={{
          value: activity.searchInput,
          onChange: activity.setSearchInput,
          placeholder: 'Search by person, machine, site or note',
          label: 'Search activity',
        }}
        filters={buildFilters(people.data)}
        values={activity.filters}
        onFilterChange={activity.updateFilter}
      />

      {activity.error && <ErrorAlert message={activity.error} onRetry={activity.reload} />}

      <Card>
        {activity.isLoading && <LinearProgress />}
        {!activity.isLoading && activity.rows.length === 0 ? (
          <EmptyState
            title={
              activity.clearFilters ? 'Nothing matches these filters.' : 'Nothing has happened yet.'
            }
            description={activity.clearFilters && 'Try a different search or clear the filters.'}
            actionLabel="Clear filters"
            onAction={activity.clearFilters}
          />
        ) : (
          <ActivityList events={activity.rows} />
        )}
        <ListPagination label="Per page:" {...activity.paginationProps} />
      </Card>
    </>
  );
};

export default ActivityPage;
