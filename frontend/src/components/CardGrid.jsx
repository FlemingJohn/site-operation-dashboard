import EmptyState from './EmptyState';

const CardGrid = ({ items, renderItem, isLoading, emptyMessage, onClearFilters }) => {
  if (!isLoading && items.length === 0) {
    return (
      <div className="card-grid-empty">
        <EmptyState
          title={emptyMessage}
          description={onClearFilters && 'Try a different search or clear the filters.'}
          actionLabel="Clear filters"
          onAction={onClearFilters}
        />
      </div>
    );
  }

  return <div className="card-grid">{items.map(renderItem)}</div>;
};

export default CardGrid;
