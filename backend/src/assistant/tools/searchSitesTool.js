import { REGIONS, SITE_STATUSES } from '../../constants.js';
import * as siteService from '../../services/siteService.js';
import { siteListQuery } from '../../validators/siteSchemas.js';
import { parseToolArguments } from '../parseToolArguments.js';

const RESULT_LIMIT = 20;

export const searchSitesTool = {
  declaration: {
    name: 'searchSites',
    description:
      'Find sites by name or city, status or region. Returns each site with its city, region, status and installation count.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Part of a site name or city' },
        status: { type: 'string', enum: SITE_STATUSES },
        region: { type: 'string', enum: REGIONS },
      },
    },
  },
  stepLabel: 'Searching sites',
  run: async (args) => {
    const { data, error } = parseToolArguments(siteListQuery, { ...args, limit: RESULT_LIMIT });
    if (error) return { response: { error } };

    const { data: sites, pagination } = await siteService.findAll(data);
    return {
      response: { total: pagination.total, sites },
      records: sites.map((site) => ({ label: site.name, path: `/sites/${site.id}` })),
      summary: `Found ${pagination.total} sites`,
    };
  },
};
