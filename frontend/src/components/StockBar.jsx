const toPercent = (value, capacity) => Math.min((value / Math.max(capacity, 1)) * 100, 100);

const StockBar = ({ part }) => {
  const reorderAt = toPercent(part.reorderAt, part.capacity);

  return (
    <svg
      className={`stock-bar stock-bar-${part.stockLevel}`}
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      role="img"
      aria-label={`${part.stock} of ${part.capacity} in stock, reorder at ${part.reorderAt}`}
    >
      <rect className="stock-bar-track" width="100" height="10" />
      <rect className="stock-bar-fill" width={toPercent(part.stock, part.capacity)} height="10" />
      <line className="stock-bar-mark" x1={reorderAt} x2={reorderAt} y1="0" y2="10" />
    </svg>
  );
};

export default StockBar;
