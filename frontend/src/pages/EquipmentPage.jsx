import { Card, LinearProgress } from '@mui/material';
import { getEquipment, getEquipmentCounts } from '../api/equipmentApi';
import CardGrid from '../components/CardGrid';
import EquipmentCard from '../components/EquipmentCard';
import EquipmentTable from '../components/EquipmentTable';
import ErrorAlert from '../components/ErrorAlert';
import ListPagination from '../components/ListPagination';
import ListToolbar from '../components/ListToolbar';
import PageIntro from '../components/PageIntro';
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
import { useListView } from '../hooks/useListView';
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
  const emptyMessage = equipment.clearFilters
    ? 'No machines match these filters.'
    : 'No machines yet.';

  return (
    <>
      <div className="page-header">
        <PageIntro>
          Every machine we own, where it is and when it needs its next check-up. The ones that need
          attention soonest come first.
        </PageIntro>
        <div className="page-header-actions">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <SummaryStrip
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

      <Card className={view === LIST_VIEWS.cards ? 'card-list' : undefined}>
        {equipment.isLoading && <LinearProgress />}
        {view === LIST_VIEWS.cards ? (
          <CardGrid
            items={equipment.rows}
            renderItem={(unit) => <EquipmentCard key={unit.id} unit={unit} />}
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
            {...equipment.sortProps}
          />
        )}
        <ListPagination label="Per page:" {...equipment.paginationProps} />
      </Card>
    </>
  );
};

export default EquipmentPage;
