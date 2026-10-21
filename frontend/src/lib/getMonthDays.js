const DAYS_IN_WEEK = 7;

const toDateKey = (date) => date.toLocaleDateString('en-CA');

export const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
  const lastDay = new Date(year, month + 1, 0);
  const cellCount = Math.ceil((mondayOffset + lastDay.getDate()) / DAYS_IN_WEEK) * DAYS_IN_WEEK;

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, month, index - mondayOffset + 1);
    return { key: toDateKey(date), day: date.getDate(), isCurrentMonth: date.getMonth() === month };
  });
};
