import { z } from 'zod';
import * as equipmentService from '../../services/equipmentService.js';
import { equipmentListQuery } from '../../validators/equipmentSchemas.js';
import { parseToolArguments } from '../parseToolArguments.js';

const MATCH_LIMIT = 5;
const HISTORY_LIMIT = 5;

const serialArguments = z.object({ serial: z.string().trim().min(1, 'Give a serial number.') });

const findExactMatch = (machines, serial) =>
  machines.find((unit) => unit.serial.toLowerCase() === serial.toLowerCase()) ??
  (machines.length === 1 ? machines[0] : null);

export const getEquipmentTool = {
  declaration: {
    name: 'getEquipment',
    description:
      'One machine by serial number, such as BY-204, with its site, next check-up, recent check-ups and parts asked for.',
    parametersJsonSchema: {
      type: 'object',
      properties: { serial: { type: 'string', description: 'Serial number, such as BY-204' } },
      required: ['serial'],
    },
  },
  stepLabel: 'Opening the machine',
  run: async (args) => {
    const { data, error } = parseToolArguments(serialArguments, args);
    if (error) return { response: { error } };

    const query = equipmentListQuery.parse({ search: data.serial, limit: MATCH_LIMIT });
    const { data: machines } = await equipmentService.findAll(query);
    const match = findExactMatch(machines, data.serial);
    if (!match) return { response: { error: 'No single machine matches that serial.', machines } };

    const unit = await equipmentService.findById(match.id);
    return {
      response: { ...unit, serviceRecords: unit.serviceRecords.slice(0, HISTORY_LIMIT) },
      records: [{ label: unit.serial, path: `/equipment/${unit.id}` }],
      summary: `Opened ${unit.serial}`,
    };
  },
};
