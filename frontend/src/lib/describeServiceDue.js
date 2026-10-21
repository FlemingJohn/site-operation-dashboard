import { SERVICE_SOON_DAYS } from '../constants';
import { formatDate } from '../utils';
import { daysUntil } from './daysUntil';
import { pluralize } from './pluralize';

export const describeServiceDue = (nextServiceOn) => {
  const days = daysUntil(nextServiceOn);
  if (days < 0)
    return `Check-up was due on ${formatDate(nextServiceOn)}, ${pluralize(-days, 'day')} ago`;
  if (days === 0) return 'Check-up is due today';
  if (days <= SERVICE_SOON_DAYS)
    return `Check-up due on ${formatDate(nextServiceOn)}, in ${pluralize(days, 'day')}`;
  return `Next check-up on ${formatDate(nextServiceOn)}`;
};
