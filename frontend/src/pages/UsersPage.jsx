import { Card, LinearProgress } from '@mui/material';
import { getUsers } from '../api/userApi';
import CardGrid from '../components/CardGrid';
import ErrorAlert from '../components/ErrorAlert';
import ListPagination from '../components/ListPagination';
import ListToolbar from '../components/ListToolbar';
import PageIntro from '../components/PageIntro';
import SuccessSnackbar from '../components/SuccessSnackbar';
import SummaryStrip from '../components/SummaryStrip';
import UserCard from '../components/UserCard';
import UserTable from '../components/UserTable';
import ViewToggle from '../components/ViewToggle';
import { LIST_PAGE_SIZE_OPTIONS, LIST_VIEWS, USER_DEFAULT_SORT, USER_ROLES } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useListCounts } from '../hooks/useListCounts';
import { useListView } from '../hooks/useListView';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { role: '' };
const NO_FILTERS = {};
const USER_COUNT_QUERIES = {
  all: {},
  technician: { role: 'technician' },
  admin: { role: 'admin' },
};

const USER_FILTERS = [
  {
    name: 'role',
    label: 'Role',
    allLabel: 'All roles',
    options: USER_ROLES,
    icon: FIELD_ICONS.role,
  },
];

const UsersPage = () => {
  const users = usePaginatedList(
    getUsers,
    INITIAL_FILTERS,
    USER_DEFAULT_SORT,
    LIST_PAGE_SIZE_OPTIONS
  );
  const counts = useListCounts(getUsers, USER_COUNT_QUERIES, NO_FILTERS, users.version);
  const [view, setView] = useListView('siteops.usersView', counts.all);
  const flash = useFlashMessage();
  const emptyMessage = users.clearFilters ? 'No users match these filters.' : 'No users yet.';

  return (
    <>
      <div className="page-header">
        <PageIntro>The admins and technicians who can be assigned to installations.</PageIntro>
        <ViewToggle value={view} onChange={setView} />
      </div>

      <SummaryStrip
        items={[
          { key: '', label: 'All users', count: counts.all },
          { key: 'technician', label: 'Technicians', count: counts.technician },
          { key: 'admin', label: 'Admins', count: counts.admin },
        ]}
        selectedKey={users.filters.role}
        onSelect={(role) => users.updateFilter('role', role)}
      />

      <ListToolbar
        search={{
          value: users.searchInput,
          onChange: users.setSearchInput,
          placeholder: 'Search by name or email',
          label: 'Search users',
        }}
        filters={USER_FILTERS}
        values={users.filters}
        onFilterChange={users.updateFilter}
      />

      {users.error && <ErrorAlert message={users.error} onRetry={users.reload} />}

      <Card className={view === LIST_VIEWS.cards ? 'card-list' : undefined}>
        {users.isLoading && <LinearProgress />}
        {view === LIST_VIEWS.cards ? (
          <CardGrid
            items={users.rows}
            renderItem={(user) => <UserCard key={user.id} user={user} />}
            isLoading={users.isLoading}
            emptyMessage={emptyMessage}
            onClearFilters={users.clearFilters}
          />
        ) : (
          <UserTable
            users={users.rows}
            isLoading={users.isLoading}
            emptyMessage={emptyMessage}
            onClearFilters={users.clearFilters}
            {...users.sortProps}
          />
        )}
        <ListPagination label="Per page:" {...users.paginationProps} />
      </Card>

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default UsersPage;
