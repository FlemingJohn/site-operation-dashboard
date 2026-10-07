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
import StatusChip from './StatusChip';

const COLUMN_COUNT = 5;

const SiteTable = ({ sites, isLoading = false, emptyMessage, onDelete }) => (
  <TableContainer>
    <Table className="data-table">
      <TableHead>
        <TableRow>
          <TableCell>Site</TableCell>
          <TableCell>Region</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Installations</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sites.map((site) => (
          <TableRow hover key={site.id}>
            <TableCell>
              <Typography variant="body2" fontWeight={500}>
                {site.name}
              </Typography>
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
                  component={Link}
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

export default SiteTable;
