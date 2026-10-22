import { INSTALLATION_STATUSES } from '../../constants.js';
import * as installationService from '../../services/installationService.js';
import { installationListQuery } from '../../validators/installationSchemas.js';
import { parseToolArguments } from '../parseToolArguments.js';

const RESULT_LIMIT = 20;

export const listInstallationsTool = {
  declaration: {
    name: 'listInstallations',
    description:
      'List installations, newest first, filtered by status, site id or a search on equipment or technician name.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Part of the equipment or technician name' },
        status: { type: 'string', enum: INSTALLATION_STATUSES },
        siteId: { type: 'integer', description: 'Site id from searchSites' },
      },
    },
  },
  stepLabel: 'Looking up installations',
  run: async (args) => {
    const { data, error } = parseToolArguments(installationListQuery, {
      ...args,
      limit: RESULT_LIMIT,
    });
    if (error) return { response: { error } };

    const { data: installations, pagination } = await installationService.findAll(data);
    return {
      response: { total: pagination.total, installations },
      records: installations.map((installation) => ({
        label: installation.siteName,
        path: `/sites/${installation.siteId}`,
      })),
      summary: `Found ${pagination.total} installations`,
    };
  },
};
