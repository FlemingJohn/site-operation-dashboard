import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, LinearProgress } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { getEquipmentUnit } from '../api/equipmentApi';
import EquipmentDetailHeader from '../components/EquipmentDetailHeader';
import ErrorAlert from '../components/ErrorAlert';
import MarkDoneDialog from '../components/MarkDoneDialog';
import PartRequestListCard from '../components/PartRequestListCard';
import ServiceHistoryCard from '../components/ServiceHistoryCard';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useRecord } from '../hooks/useRecord';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const unit = useRecord(getEquipmentUnit, id);
  const flash = useFlashMessage();
  const [isMarkingDone, setIsMarkingDone] = useState(false);

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
          <Button
            variant="contained"
            startIcon={<TaskAltIcon />}
            onClick={() => setIsMarkingDone(true)}
          >
            Mark check-up as done
          </Button>
        }
      />
      <div className="detail-columns">
        <ServiceHistoryCard records={unit.record.serviceRecords} />
        <PartRequestListCard requests={unit.record.partRequests} />
      </div>

      {isMarkingDone && (
        <MarkDoneDialog
          unit={unit.record}
          onClose={() => setIsMarkingDone(false)}
          onSaved={handleSaved}
        />
      )}

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default EquipmentDetailPage;
