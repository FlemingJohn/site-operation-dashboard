import SummaryTile from './SummaryTile';

const SummaryStrip = ({ items, selectedKey, onSelect }) => (
  <div className="summary-strip">
    {items.map((item) => (
      <SummaryTile
        key={item.key}
        label={item.label}
        count={item.count}
        isSelected={onSelect ? selectedKey === item.key : false}
        onSelect={onSelect ? () => onSelect(item.key) : undefined}
      />
    ))}
  </div>
);

export default SummaryStrip;
