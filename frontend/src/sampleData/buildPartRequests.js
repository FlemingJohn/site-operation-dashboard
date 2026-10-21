import { addDays } from '../lib/addDays';
import { getToday } from '../utils';

const REQUESTS = [
  [1, 0, 4, 'ordered', -3],
  [2, 2, 2, 'requested', -1],
  [3, 7, 1, 'delivered', -19],
  [4, 0, 2, 'requested', 0],
  [6, 4, 1, 'ordered', -6],
  [7, 1, 3, 'delivered', -12],
];

export const buildPartRequests = (equipment, spareParts, technicians) =>
  REQUESTS.map(([partId, unitIndex, quantity, status, daysAgo], index) => {
    const unit = equipment[unitIndex];
    return {
      id: index + 1,
      partId,
      partName: spareParts.find((part) => part.id === partId).name,
      equipmentId: unit.id,
      serial: unit.serial,
      siteName: unit.siteName,
      quantity,
      status,
      requestedOn: addDays(getToday(), daysAgo),
      requestedBy: technicians[index % Math.max(technicians.length, 1)]?.fullName ?? null,
    };
  });
