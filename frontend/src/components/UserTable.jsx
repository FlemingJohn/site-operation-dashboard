import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ROLE_LABELS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import EmptyTableRow from './EmptyTableRow';
import TableHeaderCell from './TableHeaderCell';

const COLUMN_COUNT = 4;

const UserTable = ({ users, isLoading = false, emptyMessage, onClearFilters, ...sortProps }) => (
  <TableContainer>
    <Table className="data-table">
      <TableHead>
        <TableRow>
          <TableHeaderCell
            column="fullName"
            label="Name"
            icon={FIELD_ICONS.person}
            {...sortProps}
          />
          <TableHeaderCell column="email" label="Email" icon={FIELD_ICONS.email} {...sortProps} />
          <TableHeaderCell label="Phone" icon={FIELD_ICONS.phone} />
          <TableHeaderCell column="role" label="Role" icon={FIELD_ICONS.role} {...sortProps} />
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow hover key={user.id}>
            <TableCell>
              <Typography variant="body2" className="text-strong">
                {user.fullName}
              </Typography>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="nowrap">{user.phone ?? '—'}</TableCell>
            <TableCell>
              <Chip variant="outlined" label={ROLE_LABELS[user.role] ?? user.role} />
            </TableCell>
          </TableRow>
        ))}
        {!isLoading && users.length === 0 && (
          <EmptyTableRow
            colSpan={COLUMN_COUNT}
            message={emptyMessage}
            onClearFilters={onClearFilters}
          />
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UserTable;
