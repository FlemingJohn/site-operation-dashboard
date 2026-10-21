import { SAMPLE_DELAY_MS } from '../constants';
import { includesText } from '../lib/includesText';
import { paginateItems } from '../lib/paginateItems';
import { wait } from '../lib/wait';
import { getSampleData } from '../sampleData/getSampleData';

const getStockLevel = ({ stock, reorderAt }) => {
  if (stock === 0) return 'out';
  if (stock <= reorderAt) return 'low';
  return 'stocked';
};

const byLowestStock = (first, second) =>
  first.stock / Math.max(first.reorderAt, 1) - second.stock / Math.max(second.reorderAt, 1);

export const getSpareParts = async (params = {}) => {
  const { spareParts } = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const matches = spareParts
    .filter((part) => includesText([part.name], params.search))
    .map((part) => ({ ...part, stockLevel: getStockLevel(part) }))
    .filter((part) => !params.stockLevel || part.stockLevel === params.stockLevel)
    .sort(byLowestStock);
  return paginateItems(matches, params);
};

export const getPartRequests = async (params = {}) => {
  const { partRequests } = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  return partRequests.filter((request) =>
    includesText([request.partName, request.serial, request.siteName], params.search)
  );
};
