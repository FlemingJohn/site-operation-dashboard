import { ACTIVITY_KINDS, ACTIVITY_PERIODS } from '../../constants.js';
import * as activityService from '../../services/activityService.js';
import { activityListQuery } from '../../validators/activitySchemas.js';
import { parseToolArguments } from '../parseToolArguments.js';

const RESULT_LIMIT = 20;

const toSentence = (event) =>
  [event.actorName ?? 'Someone', event.verb, event.target.label, event.after]
    .filter(Boolean)
    .join(' ');

export const searchActivityTool = {
  declaration: {
    name: 'searchActivity',
    description:
      'Recent changes, newest first: who did what and when. Filter by a search on person, machine, site or note, by kind, or to the last 7 or 30 days.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        search: { type: 'string' },
        kind: { type: 'string', enum: ACTIVITY_KINDS },
        days: { type: 'string', enum: ACTIVITY_PERIODS },
      },
    },
  },
  stepLabel: 'Reading the activity log',
  run: async (args) => {
    const { data, error } = parseToolArguments(activityListQuery, {
      ...args,
      limit: RESULT_LIMIT,
    });
    if (error) return { response: { error } };

    const { data: events, pagination } = await activityService.findAll(data);
    return {
      response: {
        total: pagination.total,
        events: events.map((event) => ({
          occurredAt: event.occurredAt,
          sentence: toSentence(event),
          note: event.note,
        })),
      },
      records: events.map((event) => ({ label: event.target.label, path: event.target.path })),
      summary: `Read ${events.length} changes`,
    };
  },
};
