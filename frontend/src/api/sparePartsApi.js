import { SAMPLE_DELAY_MS, STATUS_LABELS } from '../constants';
import { includesText } from '../lib/includesText';
import { paginateItems } from '../lib/paginateItems';
import { wait } from '../lib/wait';
import { getSampleData } from '../sampleData/getSampleData';
import { getToday } from '../utils';

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

const NEXT_STATUS = { requested: 'ordered', ordered: 'delivered' };

const describeRequestFor = (request) =>
  request.serial ? `for ${request.serial}` : 'for the store';

const addPartEvent = (data, request, verb, after = describeRequestFor(request)) =>
  data.activity.unshift({
    id: Date.now(),
    kind: 'part',
    occurredAt: new Date().toISOString(),
    actorName: request.requestedBy,
    verb,
    target: { label: `${request.quantity} × ${request.partName}`, path: '/spare-parts' },
    after,
    change: [request.status],
  });

export const requestPart = async (partId, { quantity, requestedBy }) => {
  const data = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const part = data.spareParts.find((item) => item.id === partId);
  const request = {
    id: Date.now(),
    partId,
    partName: part.name,
    equipmentId: null,
    serial: null,
    siteName: null,
    quantity,
    status: 'requested',
    requestedOn: getToday(),
    requestedBy,
  };
  data.partRequests.unshift(request);
  addPartEvent(data, request, 'asked for');
  return request;
};

export const moveRequestForward = async (requestId) => {
  const data = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const request = data.partRequests.find((item) => item.id === requestId);
  request.status = NEXT_STATUS[request.status] ?? request.status;
  if (request.status === 'delivered') {
    const part = data.spareParts.find((item) => item.id === request.partId);
    part.stock = Math.min(part.stock + request.quantity, part.capacity);
  }
  addPartEvent(data, request, 'marked', `as ${STATUS_LABELS[request.status].toLowerCase()}`);
  return request;
};
