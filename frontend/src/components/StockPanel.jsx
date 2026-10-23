import { useState } from 'react';
import { Card, LinearProgress } from '@mui/material';
import { deleteSparePart, getSparePartCounts, getSpareParts } from '../api/sparePartsApi';
import { STOCK_LEVELS } from '../constants';
import { useCounts } from '../hooks/useCounts';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { usePaginatedList } from '../hooks/usePaginatedList';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';
import ListPagination from './ListPagination';
import ReorderDialog from './ReorderDialog';
import SearchField from './SearchField';
import SparePartDeleteDialog from './SparePartDeleteDialog';
import StockDialog from './StockDialog';
import StockLevelRow from './StockLevelRow';
import SummaryStrip from './SummaryStrip';

const INITIAL_FILTERS = { stockLevel: '' };
const NO_SORT = {};
const NO_FILTERS = {};

const StockPanel = ({ onChange }) => {
  const parts = usePaginatedList(getSpareParts, INITIAL_FILTERS, NO_SORT);
  const counts = useCounts(getSparePartCounts, NO_FILTERS, parts.version);
  const [reorderPart, setReorderPart] = useState(null);
  const [adjustPart, setAdjustPart] = useState(null);
  const deletion = useDeleteConfirmation({
    deleteRequest: deleteSparePart,
    onDeleted: (part) => {
      onChange(`${part.name} deleted`);
      parts.refreshAfterDelete();
    },
  });

  const handleReordered = (part) => {
    setReorderPart(null);
    onChange(`Request for ${part.name} sent`);
  };

  const handleAdjusted = (part, previousStock) => {
    setAdjustPart(null);
    onChange(`${part.name} stock set from ${previousStock} to ${part.stock}`);
    parts.reload();
  };

  return (
    <>
      <SummaryStrip
        area="stock"
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
              <StockLevelRow
                key={part.id}
                part={part}
                onReorder={setReorderPart}
                onAdjust={setAdjustPart}
                onDelete={deletion.open}
              />
            ))}
          </ul>
        )}
        <ListPagination {...parts.paginationProps} />
      </Card>

      {reorderPart && (
        <ReorderDialog
          part={reorderPart}
          onClose={() => setReorderPart(null)}
          onSaved={handleReordered}
        />
      )}
      {adjustPart && (
        <StockDialog
          part={adjustPart}
          onClose={() => setAdjustPart(null)}
          onSaved={handleAdjusted}
        />
      )}
      <SparePartDeleteDialog part={deletion.item} {...deletion.dialogProps} />
    </>
  );
};

export default StockPanel;
