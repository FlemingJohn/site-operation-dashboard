import { useParams } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { getEquipmentUnit } from '../api/equipmentApi';
import EquipmentDetailHeader from '../components/EquipmentDetailHeader';
import ErrorAlert from '../components/ErrorAlert';
import PartRequestListCard from '../components/PartRequestListCard';
import ServiceHistoryCard from '../components/ServiceHistoryCard';
import { useRecord } from '../hooks/useRecord';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const unit = useRecord(getEquipmentUnit, id);

  if (unit.error)
    return <ErrorAlert message={unit.error} backTo="/equipment" backLabel="Back to equipment" />;
  if (unit.isLoading) return <LinearProgress />;

  return (
    <>
      <EquipmentDetailHeader unit={unit.record} />
      <div className="detail-columns">
        <ServiceHistoryCard records={unit.record.serviceRecords} />
        <PartRequestListCard requests={unit.record.partRequests} />
      </div>
    </>
  );
};

export default EquipmentDetailPage;
