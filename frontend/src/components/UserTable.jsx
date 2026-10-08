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
import SortableHeader from './SortableHeader';

const COLUMN_COUNT = 4;

const UserTable = ({ users, isLoading = false, emptyMessage, ...sortProps }) => (
  <TableContainer>
    <Table className="data-table">
      <TableHead>
        <TableRow>
          <SortableHeader column="fullName" label="Name" {...sortProps} />
          <SortableHeader column="email" label="Email" {...sortProps} />
          <TableCell>Phone</TableCell>
          <SortableHeader column="role" label="Role" {...sortProps} />
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
          <TableRow>
            <TableCell colSpan={COLUMN_COUNT} align="center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UserTable;
