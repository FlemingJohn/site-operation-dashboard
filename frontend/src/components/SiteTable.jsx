import { Link as RouterLink } from 'react-router-dom';
import {
  IconButton,
  Link,
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
import { FIELD_ICONS } from '../fieldIcons';
import EmptyTableRow from './EmptyTableRow';
import TableHeaderCell from './TableHeaderCell';
import StatusChip from './StatusChip';

const COLUMN_COUNT = 5;

const SiteTable = ({
  sites,
  isLoading = false,
  emptyMessage,
  onClearFilters,
  onDelete,
  ...sortProps
}) => (
  <TableContainer>
    <Table className="data-table">
      <TableHead>
        <TableRow>
          <TableHeaderCell column="name" label="Site" icon={FIELD_ICONS.site} {...sortProps} />
          <TableHeaderCell
            column="region"
            label="Region"
            icon={FIELD_ICONS.region}
            {...sortProps}
          />
          <TableHeaderCell
            column="status"
            label="Status"
            icon={FIELD_ICONS.status}
            {...sortProps}
          />
          <TableHeaderCell
            column="installationCount"
            label="Installations"
            icon={FIELD_ICONS.equipment}
            align="right"
            {...sortProps}
          />
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sites.map((site) => (
          <TableRow hover key={site.id}>
            <TableCell>
              <Link component={RouterLink} to={`/sites/${site.id}`} className="text-strong">
                {site.name}
              </Link>
              <br />
              <Typography variant="caption" color="text.secondary">
                {site.city}
              </Typography>
            </TableCell>
            <TableCell>{site.region}</TableCell>
            <TableCell>
              <StatusChip status={site.status} />
            </TableCell>
            <TableCell align="right">{site.installationCount}</TableCell>
            <TableCell align="right" className="nowrap">
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  component={RouterLink}
                  to={`/sites/${site.id}/edit`}
                  aria-label={`Edit ${site.name}`}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  aria-label={`Delete ${site.name}`}
                  onClick={() => onDelete(site)}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
        {!isLoading && sites.length === 0 && (
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

export default SiteTable;
