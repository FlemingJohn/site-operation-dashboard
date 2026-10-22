import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PartRequestsPanel from '../components/PartRequestsPanel';
import StockPanel from '../components/StockPanel';
import SuccessSnackbar from '../components/SuccessSnackbar';
import ViewToggle from '../components/ViewToggle';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useStoredChoice } from '../hooks/useStoredChoice';

const PART_VIEWS = [
  { value: 'stock', label: 'Stock', icon: Inventory2OutlinedIcon },
  { value: 'requests', label: 'Requests', icon: AssignmentOutlinedIcon },
];

const SparePartsPage = () => {
  const [view, setView] = useStoredChoice('siteops.sparePartsView');
  const flash = useFlashMessage();

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <ViewToggle value={view ?? 'stock'} onChange={setView} options={PART_VIEWS} />
        </div>
      </div>

      {view === 'requests' ? (
        <PartRequestsPanel onChange={flash.showMessage} />
      ) : (
        <StockPanel onChange={flash.showMessage} />
      )}

      <SuccessSnackbar message={flash.message} onClose={flash.clearMessage} />
    </>
  );
};

export default SparePartsPage;
