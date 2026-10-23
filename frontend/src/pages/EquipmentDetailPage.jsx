import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, LinearProgress } from '@mui/material';
import { deleteEquipment, getEquipmentUnit } from '../api/equipmentApi';
import EquipmentDeleteDialog from '../components/EquipmentDeleteDialog';
import EquipmentDetailActions from '../components/EquipmentDetailActions';
import EquipmentDetailHeader from '../components/EquipmentDetailHeader';
import ErrorAlert from '../components/ErrorAlert';
import HistoryCard from '../components/HistoryCard';
import MarkDoneDialog from '../components/MarkDoneDialog';
import PartRequestListCard from '../components/PartRequestListCard';
import ServiceHistoryCard from '../components/ServiceHistoryCard';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useMoveToStock } from '../hooks/useMoveToStock';
import { useRecord } from '../hooks/useRecord';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const unit = useRecord(getEquipmentUnit, id);
  const flash = useFlashMessage();
  const [isMarkingDone, setIsMarkingDone] = useState(false);
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteEquipment,
    onDeleted: (deleted) =>
      navigate('/equipment', { state: { message: `${deleted.serial} deleted` } }),
  });
  const stock = useMoveToStock((moved) => {
    deletion.dialogProps.onCancel();
    flash.showMessage(`${moved.serial} moved to In stock`);
    unit.reload();
  });

  const handleSaved = (saved) => {
    setIsMarkingDone(false);
    flash.showMessage(`Check-up for ${saved.serial} saved`);
    unit.reload();
  };

  if (unit.error)
    return <ErrorAlert message={unit.error} backTo="/equipment" backLabel="Back to equipment" />;
  if (unit.isLoading) return <LinearProgress />;

  return (
    <>
      <EquipmentDetailHeader
        unit={unit.record}
        action={
          <EquipmentDetailActions
            unit={unit.record}
            onMarkDone={() => setIsMarkingDone(true)}
            onDelete={() => deletion.open(unit.record)}
          />
        }
      />
      {stock.error && (
        <Alert severity="error" onClose={stock.clearError}>
          {stock.error}
        </Alert>
      )}
      <div className="detail-columns">
        <ServiceHistoryCard records={unit.record.serviceRecords} />
        <PartRequestListCard requests={unit.record.partRequests} />
      </div>
      <HistoryCard path={`/equipment/${id}`} />

      {isMarkingDone && (
        <MarkDoneDialog
          unit={unit.record}
          onClose={() => setIsMarkingDone(false)}
          onSaved={handleSaved}
        />
      )}

      <EquipmentDeleteDialog
        unit={deletion.item}
        onMoveToStock={stock.move}
        isMoving={stock.isMoving}
        {...deletion.dialogProps}
      />

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default EquipmentDetailPage;
