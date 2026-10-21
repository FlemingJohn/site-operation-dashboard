import { SAMPLE_DELAY_MS } from '../constants';
import { includesText } from '../lib/includesText';
import { paginateItems } from '../lib/paginateItems';
import { sortItems } from '../lib/sortItems';
import { wait } from '../lib/wait';
import { getSampleData } from '../sampleData/getSampleData';

const DAY_MS = 86400000;

const isWithinDays = (occurredAt, days) =>
  !days || Date.now() - new Date(occurredAt).getTime() <= Number(days) * DAY_MS;

const matchesFilters = (event, { search, kind, actor, days, path }) =>
  includesText(
    [event.actorName, event.verb, event.target.label, event.after, event.note],
    search
  ) &&
  (!kind || event.kind === kind) &&
  (!actor || event.actorName === actor) &&
  (!path || event.target.path === path) &&
  isWithinDays(event.occurredAt, days);

export const getActivity = async (params = {}) => {
  const { activity } = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const matches = activity.filter((event) => matchesFilters(event, params));
  return paginateItems(sortItems(matches, params), params);
};

export const getActivityPeople = async () => {
  const { activity } = await getSampleData();
  return [...new Set(activity.map((event) => event.actorName))].sort();
};
