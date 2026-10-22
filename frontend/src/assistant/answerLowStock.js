import { getPartRequests, getSpareParts } from '../api/sparePartsApi';
import { MAX_SELECT_OPTIONS } from '../constants';
import { joinLines } from '../lib/joinLines';
import { pluralize } from '../lib/pluralize';

const OPEN_STATUSES = ['requested', 'ordered'];

const describePart = (part, openRequests) => {
  const isOnItsWay = openRequests.some((request) => request.partId === part.id);
  const stockText = part.stock === 0 ? 'none left' : `${part.stock} left`;
  return `${part.name}: ${stockText}, reorder at ${part.reorderAt}.${isOnItsWay ? ' A request is already open.' : ''}`;
};

export const answerLowStock = async () => {
  const [parts, requests] = await Promise.all([
    getSpareParts({ limit: MAX_SELECT_OPTIONS }),
    getPartRequests({ limit: MAX_SELECT_OPTIONS }),
  ]);
  const lowParts = parts.data.filter((part) => part.stockLevel !== 'stocked');
  const openRequests = requests.data.filter((request) => OPEN_STATUSES.includes(request.status));

  const intro = `${pluralize(lowParts.length, 'part')} ${lowParts.length === 1 ? 'is' : 'are'} running low.`;
  const text = lowParts.length
    ? joinLines(
        intro,
        lowParts.map((part) => describePart(part, openRequests))
      )
    : 'Every spare part is above its reorder level.';

  return {
    steps: ['Looking at spare parts stock', 'Checking open part requests'],
    text,
    records: lowParts.length ? [{ label: 'Spare parts', path: '/spare-parts' }] : [],
    sources: [
      { tool: 'listLowStockParts', summary: `Looked at ${pluralize(parts.data.length, 'part')}` },
      { tool: 'listPartRequests', summary: `${pluralize(openRequests.length, 'open request')}` },
    ],
  };
};
