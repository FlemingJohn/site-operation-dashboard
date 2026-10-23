import { Alert, Button } from '@mui/material';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import { pluralize } from '../lib/pluralize';
import DeleteDialog from './DeleteDialog';

const EquipmentDeleteDialog = ({ unit, onMoveToStock, isMoving, ...dialogProps }) => {
  const hasHistory = unit?.serviceCount > 0;
  const canMove = hasHistory && unit.status !== 'in_stock';

  return (
    <DeleteDialog
      {...dialogProps}
      title={describeTitle(unit, hasHistory)}
      message={describeMessage(unit, hasHistory)}
      canDelete={!hasHistory}
    >
      {hasHistory && (
        <Alert severity="info">
          {canMove
            ? 'Take it off its site instead: it moves to In stock and stays in the list with its history.'
            : 'It is already in stock, in the warehouse, with its history kept.'}
        </Alert>
      )}
      {canMove && (
        <Button
          variant="outlined"
          startIcon={<WarehouseOutlinedIcon />}
          onClick={() => onMoveToStock(unit)}
          disabled={isMoving}
          className="dialog-side-action"
        >
          {isMoving ? 'Moving…' : 'Move to In stock'}
        </Button>
      )}
      {!hasHistory && unit?.requestCount > 0 && (
        <Alert severity="warning">
          {pluralize(unit.requestCount, 'part request')} for it stay on the Spare parts page,
          marked as for a deleted machine.
        </Alert>
      )}
    </DeleteDialog>
  );
};

const describeTitle = (unit, hasHistory) => {
  if (!unit) return 'Delete machine?';
  return hasHistory ? `${unit.serial} can't be deleted` : `Delete ${unit.serial}?`;
};

const describeMessage = (unit, hasHistory) => {
  if (!unit) return '';
  if (hasHistory) {
    return `It has ${pluralize(unit.serviceCount, 'check-up')} on record. Deleting it would lose that history.`;
  }
  return `${unit.serial} will be permanently deleted.`;
};

export default EquipmentDeleteDialog;
