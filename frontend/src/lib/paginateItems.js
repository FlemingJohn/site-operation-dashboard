export const paginateItems = (items, { page = 1, limit = 10 }) => {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
    },
  };
};
