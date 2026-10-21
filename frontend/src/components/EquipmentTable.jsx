import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import EmptyTableRow from './EmptyTableRow';
import ServiceDueLine from './ServiceDueLine';
import StatusChip from './StatusChip';
import TableHeaderCell from './TableHeaderCell';

const COLUMN_COUNT = 5;

const EquipmentTable = ({
  equipment,
  isLoading = false,
  emptyMessage,
  onClearFilters,
  ...sortProps
}) => (
  <TableContainer>
    <Table className="data-table">
      <TableHead>
        <TableRow>
          <TableHeaderCell
            column="serial"
            label="Machine"
            icon={FIELD_ICONS.equipment}
            {...sortProps}
          />
          <TableHeaderCell column="type" label="Type" icon={FIELD_ICONS.type} {...sortProps} />
          <TableHeaderCell column="siteName" label="Site" icon={FIELD_ICONS.site} {...sortProps} />
          <TableHeaderCell
            column="status"
            label="Status"
            icon={FIELD_ICONS.status}
            {...sortProps}
          />
          <TableHeaderCell
            column="nextServiceOn"
            label="Check-up"
            icon={FIELD_ICONS.service}
            {...sortProps}
          />
        </TableRow>
      </TableHead>
      <TableBody>
        {equipment.map((unit) => (
          <TableRow hover key={unit.id}>
            <TableCell>
              <Link component={RouterLink} to={`/equipment/${unit.id}`} className="text-strong">
                {unit.serial}
              </Link>
            </TableCell>
            <TableCell>{EQUIPMENT_TYPE_LABELS[unit.type]}</TableCell>
            <TableCell>{unit.siteName ?? 'In the warehouse'}</TableCell>
            <TableCell>
              <StatusChip status={unit.status} />
            </TableCell>
            <TableCell>
              <ServiceDueLine unit={unit} />
            </TableCell>
          </TableRow>
        ))}
        {!isLoading && equipment.length === 0 && (
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

export default EquipmentTable;
