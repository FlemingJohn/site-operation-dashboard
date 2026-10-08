export const formatDate = (isoDate) =>
  new Date(`${isoDate.slice(0, 10)}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const getToday = () => new Date().toLocaleDateString('en-CA');

export const toOptions = (items, labelKey) =>
  items.map((item) => ({ value: String(item.id), label: item[labelKey] }));

export const getPercentage = (part, total) => (total === 0 ? 0 : Math.round((part / total) * 100));
