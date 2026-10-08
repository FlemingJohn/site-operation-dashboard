import { Link } from 'react-router-dom';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { formatDate } from '../utils';
import { FIELD_ICONS } from '../fieldIcons';
import EmptyTableRow from './EmptyTableRow';
import TableHeaderCell from './TableHeaderCell';
import StatusChip from './StatusChip';

const InstallationTable = ({
  installations,
  isLoading = false,
  emptyMessage,
  onClearFilters,
  onDelete,
  ...sortProps
}) => {
  const showActions = Boolean(onDelete);
  const columnCount = showActions ? 6 : 5;

  return (
    <TableContainer>
      <Table className="data-table">
        <TableHead>
          <TableRow>
            <TableHeaderCell
              column="equipment"
              label="Equipment"
              icon={FIELD_ICONS.equipment}
              {...sortProps}
            />
            <TableHeaderCell
              column="siteName"
              label="Site"
              icon={FIELD_ICONS.site}
              {...sortProps}
            />
            <TableHeaderCell
              column="technicianName"
              label="Technician"
              icon={FIELD_ICONS.person}
              {...sortProps}
            />
            <TableHeaderCell
              column="installedOn"
              label="Date"
              icon={FIELD_ICONS.date}
              {...sortProps}
            />
            <TableHeaderCell
              column="status"
              label="Status"
              icon={FIELD_ICONS.status}
              {...sortProps}
            />
            {showActions && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {installations.map((installation) => (
            <TableRow hover key={installation.id}>
              <TableCell>
                <Typography variant="body2" className="text-strong">
                  {installation.equipment}
                </Typography>
              </TableCell>
              <TableCell>{installation.siteName}</TableCell>
              <TableCell>{installation.technicianName ?? 'Unassigned'}</TableCell>
              <TableCell className="nowrap">{formatDate(installation.installedOn)}</TableCell>
              <TableCell>
                <StatusChip status={installation.status} />
              </TableCell>
              {showActions && (
                <TableCell align="right" className="nowrap">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/installations/${installation.id}/edit`}
                      aria-label={`Edit ${installation.equipment}`}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Delete ${installation.equipment}`}
                      onClick={() => onDelete(installation)}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
          {!isLoading && installations.length === 0 && (
            <EmptyTableRow
              colSpan={columnCount}
              message={emptyMessage}
              onClearFilters={onClearFilters}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InstallationTable;
