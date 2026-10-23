import * as activityService from './activityService.js';

const SPARE_PARTS_PATH = '/spare-parts';

const toTarget = (part) => ({ label: part.name, path: SPARE_PARTS_PATH });

export const recordAdded = (client, part) =>
  activityService.record(client, {
    kind: 'part',
    verb: 'added the part',
    target: toTarget(part),
    after: `with ${part.stock} in stock`,
  });

export const recordChanged = (client, part) =>
  activityService.record(client, {
    kind: 'part',
    verb: 'updated the part',
    target: toTarget(part),
    after: `${part.stock} in stock, reorder at ${part.reorderAt}`,
  });

export const recordStockSet = (client, before, after, reason) =>
  activityService.record(client, {
    kind: 'part',
    verb: 'set the stock of',
    target: toTarget(after),
    after: `from ${before.stock} to ${after.stock}`,
    change: [before.stockLevel, after.stockLevel],
    note: reason,
  });

export const recordDeleted = (client, part) =>
  activityService.record(client, {
    kind: 'part',
    verb: 'deleted the part',
    target: toTarget(part),
  });
