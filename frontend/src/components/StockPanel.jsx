import { useState } from 'react';
import { Card, LinearProgress } from '@mui/material';
import { getSpareParts } from '../api/sparePartsApi';
import { STOCK_LEVELS } from '../constants';
import { useListCounts } from '../hooks/useListCounts';
import { usePaginatedList } from '../hooks/usePaginatedList';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import ListPagination from './ListPagination';
import ReorderDialog from './ReorderDialog';
import SearchField from './SearchField';
import StockLevelRow from './StockLevelRow';
import SummaryStrip from './SummaryStrip';

const INITIAL_FILTERS = { stockLevel: '' };
const NO_SORT = {};
const NO_FILTERS = {};
const LEVEL_COUNT_QUERIES = Object.fromEntries([
  ['all', {}],
  ...STOCK_LEVELS.map(({ value }) => [value, { stockLevel: value }]),
]);

const StockPanel = ({ onChange }) => {
  const parts = usePaginatedList(getSpareParts, INITIAL_FILTERS, NO_SORT);
  const counts = useListCounts(getSpareParts, LEVEL_COUNT_QUERIES, NO_FILTERS);
  const [reorderPart, setReorderPart] = useState(null);

  const handleSaved = (part) => {
    setReorderPart(null);
    onChange(`Request for ${part.name} sent`);
  };

  return (
    <>
      <SummaryStrip
        items={[
          { key: '', label: 'All parts', count: counts.all },
          ...STOCK_LEVELS.map(({ value, label }) => ({ key: value, label, count: counts[value] })),
        ]}
        selectedKey={parts.filters.stockLevel}
        onSelect={(level) => parts.updateFilter('stockLevel', level)}
      />

      <SearchField
        value={parts.searchInput}
        onChange={parts.setSearchInput}
        placeholder="Search by part name"
        label="Search spare parts"
      />

      {parts.error && <ErrorAlert message={parts.error} onRetry={parts.reload} />}

      <Card>
        {parts.isLoading && <LinearProgress />}
        {!parts.isLoading && parts.rows.length === 0 ? (
          <EmptyState
            title="No parts match this search."
            actionLabel="Clear filters"
            onAction={parts.clearFilters}
          />
        ) : (
          <ul className="stock-list">
            {parts.rows.map((part) => (
              <StockLevelRow key={part.id} part={part} onReorder={setReorderPart} />
            ))}
          </ul>
        )}
        <ListPagination {...parts.paginationProps} />
      </Card>

      {reorderPart && (
        <ReorderDialog
          part={reorderPart}
          onClose={() => setReorderPart(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default StockPanel;
