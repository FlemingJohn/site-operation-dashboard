export const toLikePattern = (text) => `%${text.replace(/[\\%_]/g, '\\$&')}%`;

export const buildOrderBy = (columns, { sortBy, order }, tieBreaker) => {
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  return `ORDER BY ${columns[sortBy]} ${direction} NULLS LAST, ${tieBreaker} ${direction}`;
};

export const buildWhereClause = (filters) => {
  const values = [];
  const conditions = [];

  filters.forEach(({ value, clause }) => {
    if (value === undefined || value === null || value === '') return;
    values.push(value);
    conditions.push(clause(`$${values.length}`));
  });

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
};
