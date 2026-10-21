import { getToday } from '../utils';

const DAY_MS = 86400000;

export const daysUntil = (date) =>
  Math.round((new Date(`${date}T00:00:00`) - new Date(`${getToday()}T00:00:00`)) / DAY_MS);
