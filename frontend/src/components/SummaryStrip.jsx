import { STATE_ICONS } from '../stateIcons';
import SummaryTile from './SummaryTile';

const SummaryStrip = ({ area, items, selectedKey, onSelect }) => (
  <div className="summary-strip">
    {items.map((item) => (
      <SummaryTile
        key={item.key}
        label={item.label}
        count={item.count}
        {...STATE_ICONS[area]?.[item.key]}
        isSelected={onSelect ? selectedKey === item.key : false}
        onSelect={onSelect ? () => onSelect(item.key) : undefined}
      />
    ))}
  </div>
);

export default SummaryStrip;
