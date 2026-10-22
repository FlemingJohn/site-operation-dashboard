import { useState } from 'react';
import { Button, Card, CardHeader, LinearProgress } from '@mui/material';
import { getServiceDue } from '../api/serviceApi';
import { useLoadMore } from '../hooks/useLoadMore';
import { pluralize } from '../lib/pluralize';
import ErrorAlert from './ErrorAlert';
import ServiceItem from './ServiceItem';

const GROUP_PAGE_SIZE = 8;

const ServiceGroup = ({
  state,
  title,
  search,
  emptyMessage,
  isOpenByDefault = true,
  onMarkDone,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const units = useLoadMore(getServiceDue, { state, search }, GROUP_PAGE_SIZE);
  const hiddenCount = units.total - units.items.length;

  const toggleButton = units.total > 0 && (
    <Button size="small" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
      {isOpen ? 'Hide them' : 'Show them'}
    </Button>
  );

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={units.total ? pluralize(units.total, 'machine') : emptyMessage}
        action={toggleButton}
      />
      {units.isLoading && <LinearProgress />}
      {units.error && <ErrorAlert message={units.error} />}
      {isOpen && units.items.length > 0 && (
        <ul className="service-list">
          {units.items.map((unit) => (
            <ServiceItem key={unit.id} unit={unit} onMarkDone={onMarkDone} />
          ))}
        </ul>
      )}
      {isOpen && units.hasMore && (
        <div className="service-more">
          <Button size="small" disabled={units.isLoading} onClick={units.loadMore}>
            Show {Math.min(hiddenCount, GROUP_PAGE_SIZE)} more
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ServiceGroup;
