import { formatDate, getToday } from '../utils';
import { addDays } from './addDays';

const toDayKey = (isoDateTime) => new Date(isoDateTime).toLocaleDateString('en-CA');

const describeDay = (day) => {
  if (day === getToday()) return 'Today';
  if (day === addDays(getToday(), -1)) return 'Yesterday';
  return formatDate(day);
};

export const groupByDay = (events) =>
  events.reduce((groups, event) => {
    const day = toDayKey(event.occurredAt);
    const current = groups[groups.length - 1];
    if (current?.day === day) current.events.push(event);
    else groups.push({ day, label: describeDay(day), events: [event] });
    return groups;
  }, []);
