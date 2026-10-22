import { MAX_PAGE_SIZE } from '../../constants.js';
import * as partRequestService from '../../services/partRequestService.js';
import * as sparePartService from '../../services/sparePartService.js';
import { partRequestListQuery } from '../../validators/partRequestSchemas.js';
import { sparePartListQuery } from '../../validators/sparePartSchemas.js';

const OPEN_STATUSES = ['requested', 'ordered'];

const findOpenRequests = async () => {
  const results = await Promise.all(
    OPEN_STATUSES.map((status) =>
      partRequestService.findAll(partRequestListQuery.parse({ status, limit: MAX_PAGE_SIZE }))
    )
  );
  return results.flatMap((result) => result.data);
};

export const listLowStockPartsTool = {
  declaration: {
    name: 'listLowStockParts',
    description:
      'Spare parts that are out of stock or at or below their reorder level, lowest first, with any open requests for them.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  stepLabel: 'Looking at spare parts stock',
  run: async () => {
    const [parts, openRequests] = await Promise.all([
      sparePartService.findAll(sparePartListQuery.parse({ limit: MAX_PAGE_SIZE })),
      findOpenRequests(),
    ]);
    const lowParts = parts.data
      .filter((part) => part.stockLevel !== 'stocked')
      .map((part) => ({
        ...part,
        openRequests: openRequests.filter((request) => request.partId === part.id),
      }));

    return {
      response: { lowParts },
      records: lowParts.length ? [{ label: 'Spare parts', path: '/spare-parts' }] : [],
      summary: `Found ${lowParts.length} parts running low`,
    };
  },
};
