import { Alert, Card, LinearProgress } from '@mui/material';
import { deleteEquipment, getEquipment, getEquipmentCounts } from '../api/equipmentApi';
import CardGrid from '../components/CardGrid';
import EquipmentCard from '../components/EquipmentCard';
import EquipmentDeleteDialog from '../components/EquipmentDeleteDialog';
import EquipmentTable from '../components/EquipmentTable';
import ErrorAlert from '../components/ErrorAlert';
import ListPagination from '../components/ListPagination';
import ListToolbar from '../components/ListToolbar';
import SuccessSnackbar from '../components/SuccessSnackbar';
import SummaryStrip from '../components/SummaryStrip';
import ViewToggle from '../components/ViewToggle';
import {
  EQUIPMENT_DEFAULT_SORT,
  EQUIPMENT_STATUSES,
  EQUIPMENT_TYPES,
  LIST_PAGE_SIZE_OPTIONS,
  LIST_VIEWS,
} from '../constants';
import { FIELD_ICONS } from '../fieldIcons';
import { useCounts } from '../hooks/useCounts';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useListView } from '../hooks/useListView';
import { useMoveToStock } from '../hooks/useMoveToStock';
import { usePaginatedList } from '../hooks/usePaginatedList';

const INITIAL_FILTERS = { type: '', status: '' };
const NO_FILTERS = {};

const EQUIPMENT_FILTERS = [
  {
    name: 'type',
    label: 'Type',
    allLabel: 'All types',
    options: EQUIPMENT_TYPES,
    icon: FIELD_ICONS.type,
  },
  {
    name: 'status',
    label: 'Status',
    allLabel: 'All statuses',
    options: EQUIPMENT_STATUSES,
    icon: FIELD_ICONS.status,
  },
];

const EquipmentPage = () => {
  const equipment = usePaginatedList(
    getEquipment,
    INITIAL_FILTERS,
    EQUIPMENT_DEFAULT_SORT,
    LIST_PAGE_SIZE_OPTIONS
  );
  const counts = useCounts(getEquipmentCounts, NO_FILTERS, equipment.version);
  const [view, setView] = useListView('siteops.equipmentView', counts.all);
  const flash = useFlashMessage();
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteEquipment,
    onDeleted: (unit) => {
      flash.showMessage(`${unit.serial} deleted`);
      equipment.refreshAfterDelete();
    },
  });
  const stock = useMoveToStock((unit) => {
    deletion.dialogProps.onCancel();
    flash.showMessage(`${unit.serial} moved to In stock`);
    equipment.reload();
  });
  const rowActions = { onMoveToStock: stock.move, onDelete: deletion.open };
  const emptyMessage = equipment.clearFilters
    ? 'No machines match these filters.'
    : 'No machines yet.';

  return (
    <>
      <div className="page-header">
        <div className="page-header-actions">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <SummaryStrip
        area="equipment"
        items={[
          { key: '', label: 'All machines', count: counts.all },
          ...EQUIPMENT_TYPES.map(({ value, label }) => ({
            key: value,
            label,
            count: counts[value],
          })),
        ]}
        selectedKey={equipment.filters.type}
        onSelect={(type) => equipment.updateFilter('type', type)}
      />

      <ListToolbar
        search={{
          value: equipment.searchInput,
          onChange: equipment.setSearchInput,
          placeholder: 'Search by serial number or site',
          label: 'Search equipment',
        }}
        filters={EQUIPMENT_FILTERS}
        values={equipment.filters}
        onFilterChange={equipment.updateFilter}
      />

      {equipment.error && <ErrorAlert message={equipment.error} onRetry={equipment.reload} />}
      {stock.error && (
        <Alert severity="error" onClose={stock.clearError}>
          {stock.error}
        </Alert>
      )}

      <Card className={view === LIST_VIEWS.cards ? 'card-list' : undefined}>
        {equipment.isLoading && <LinearProgress />}
        {view === LIST_VIEWS.cards ? (
          <CardGrid
            items={equipment.rows}
            renderItem={(unit) => <EquipmentCard key={unit.id} unit={unit} {...rowActions} />}
            isLoading={equipment.isLoading}
            emptyMessage={emptyMessage}
            onClearFilters={equipment.clearFilters}
          />
        ) : (
          <EquipmentTable
            equipment={equipment.rows}
            isLoading={equipment.isLoading}
            emptyMessage={emptyMessage}
            onClearFilters={equipment.clearFilters}
            {...rowActions}
            {...equipment.sortProps}
          />
        )}
        <ListPagination label="Per page:" {...equipment.paginationProps} />
      </Card>

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

export default EquipmentPage;
