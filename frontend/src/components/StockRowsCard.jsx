import { useState } from 'react';
import ReorderPartCard from './ReorderPartCard';
import SeeAllLink from './SeeAllLink';
import StockLevelRow from './StockLevelRow';

const StockRowsCard = ({ parts, total, seeAll, onOpenRecord }) => {
  const [chosen, setChosen] = useState(null);

  return (
    <>
      <ul className="stock-list assistant-stock">
        {parts.map((part) => (
          <StockLevelRow key={part.id} part={part} onReorder={chosen ? undefined : setChosen} />
        ))}
      </ul>
      <SeeAllLink
        shown={parts.length}
        total={total ?? parts.length}
        seeAll={seeAll}
        onOpenRecord={onOpenRecord}
      />
      {chosen && (
        <ReorderPartCard
          part={chosen}
          quantity={null}
          requestedBy={null}
          onOpenRecord={onOpenRecord}
        />
      )}
    </>
  );
};

export default StockRowsCard;
