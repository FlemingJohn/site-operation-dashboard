import { Card, LinearProgress, TablePagination } from '@mui/material';
import { getUsers } from '../api/userApi';
import ErrorAlert from '../components/ErrorAlert';
import ListToolbar from '../components/ListToolbar';
import SuccessSnackbar from '../components/SuccessSnackbar';
import UserTable from '../components/UserTable';
import { USER_DEFAULT_SORT, USER_ROLES } from '../constants';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { role: '' };

const USER_FILTERS = [{ name: 'role', label: 'Role', allLabel: 'All roles', options: USER_ROLES }];

const UsersPage = () => {
  const users = usePaginatedList(getUsers, INITIAL_FILTERS, USER_DEFAULT_SORT);
  const flash = useFlashMessage();

  return (
    <>
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

      <Card>
        {users.isLoading && <LinearProgress />}
        <UserTable
          users={users.rows}
          isLoading={users.isLoading}
          emptyMessage="No users match these filters."
          {...users.sortProps}
        />
        <TablePagination component="div" {...users.paginationProps} />
      </Card>

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default UsersPage;
