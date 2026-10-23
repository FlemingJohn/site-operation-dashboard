const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatChatTime = (isoDateTime) => {
  const date = new Date(isoDateTime);
  const daysAgo = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS);
  if (daysAgo === 0)
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (daysAgo === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};
