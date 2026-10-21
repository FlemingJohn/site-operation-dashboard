const compareValues = (first, second) => {
  if (first === second) return 0;
  if (first === null || first === undefined) return 1;
  if (second === null || second === undefined) return -1;
  return String(first).localeCompare(String(second), undefined, { numeric: true });
};

export const sortItems = (items, { sortBy, order = 'asc' }) => {
  if (!sortBy) return items;
  const direction = order === 'desc' ? -1 : 1;
  return [...items].sort(
    (first, second) => compareValues(first[sortBy], second[sortBy]) * direction
  );
};
