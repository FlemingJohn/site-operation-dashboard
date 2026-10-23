import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import EmptyTableRow from './EmptyTableRow';
import EquipmentMenu from './EquipmentMenu';
import RowTitle from './RowTitle';
import ServiceDueLine from './ServiceDueLine';
import StatusChip from './StatusChip';
import TableHeaderCell from './TableHeaderCell';

const COLUMN_COUNT = 6;

const EquipmentTable = ({
  equipment,
  isLoading = false,
  emptyMessage,
  onClearFilters,
  onMoveToStock,
  onDelete,
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
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {equipment.map((unit) => (
          <TableRow hover key={unit.id}>
            <TableCell>
              <RowTitle title={unit.serial} path={`/equipment/${unit.id}`} />
            </TableCell>
            <TableCell>{EQUIPMENT_TYPE_LABELS[unit.type]}</TableCell>
            <TableCell>{unit.siteName ?? 'In the warehouse'}</TableCell>
            <TableCell>
              <StatusChip status={unit.status} />
            </TableCell>
            <TableCell>
              <ServiceDueLine unit={unit} />
            </TableCell>
            <TableCell align="right">
              <EquipmentMenu
                unit={unit}
                onMoveToStock={onMoveToStock}
                onDelete={onDelete}
                className="table-row-menu"
              />
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
