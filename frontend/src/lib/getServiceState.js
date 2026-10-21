import { SERVICE_SOON_DAYS } from '../constants';
import { daysUntil } from './daysUntil';

export const getServiceState = (nextServiceOn) => {
  const days = daysUntil(nextServiceOn);
  if (days < 0) return 'late';
  if (days <= SERVICE_SOON_DAYS) return 'this_week';
  return 'later';
};
