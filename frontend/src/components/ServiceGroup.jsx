import { useState } from 'react';
import { Button, Card, CardHeader } from '@mui/material';
import { pluralize } from '../lib/pluralize';
import ServiceItem from './ServiceItem';

const GROUP_PAGE_SIZE = 8;

const ServiceGroup = ({ title, units, emptyMessage, isOpenByDefault = true, onMarkDone }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const [visibleCount, setVisibleCount] = useState(GROUP_PAGE_SIZE);
  const hiddenCount = units.length - visibleCount;

  const toggleButton = units.length > 0 && (
    <Button size="small" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
      {isOpen ? 'Hide them' : 'Show them'}
    </Button>
  );

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={units.length ? pluralize(units.length, 'machine') : emptyMessage}
        action={toggleButton}
      />
      {isOpen && units.length > 0 && (
        <ul className="service-list">
          {units.slice(0, visibleCount).map((unit) => (
            <ServiceItem key={unit.id} unit={unit} onMarkDone={onMarkDone} />
          ))}
        </ul>
      )}
      {isOpen && hiddenCount > 0 && (
        <div className="service-more">
          <Button size="small" onClick={() => setVisibleCount(visibleCount + GROUP_PAGE_SIZE)}>
            Show {Math.min(hiddenCount, GROUP_PAGE_SIZE)} more
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ServiceGroup;
