export const getStockLevel = ({ stock, reorderAt }) => {
  if (stock === 0) return 'out';
  return stock <= reorderAt ? 'low' : 'stocked';
};
