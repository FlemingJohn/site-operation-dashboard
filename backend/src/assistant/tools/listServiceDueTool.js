import { SERVICE_STATES } from '../../constants.js';
import * as equipmentService from '../../services/equipmentService.js';
import { equipmentListQuery } from '../../validators/equipmentSchemas.js';
import { parseToolArguments } from '../parseToolArguments.js';

const RESULT_LIMIT = 20;

export const listServiceDueTool = {
  declaration: {
    name: 'listServiceDue',
    description:
      'Machines ordered by their next check-up date, soonest first. state: late = overdue, this_week = due in the next 7 days, later = further ahead.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        state: { type: 'string', enum: SERVICE_STATES },
        search: { type: 'string', description: 'Part of a serial number or site name' },
      },
    },
  },
  stepLabel: 'Checking which machines are due a check-up',
  run: async (args) => {
    const { data, error } = parseToolArguments(equipmentListQuery, {
      ...args,
      limit: RESULT_LIMIT,
    });
    if (error) return { response: { error } };

    const { data: machines, pagination } = await equipmentService.findAll(data);
    return {
      response: { total: pagination.total, machines },
      records: machines.map((unit) => ({ label: unit.serial, path: `/equipment/${unit.id}` })),
      summary: `Looked at ${pagination.total} machines`,
    };
  },
};
