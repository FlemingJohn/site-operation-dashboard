import { getSites } from '../api/siteApi';
import { MAX_SELECT_OPTIONS } from '../constants';
import { joinLines } from '../lib/joinLines';
import { pluralize } from '../lib/pluralize';

const describeSite = (site) =>
  `${site.name} in ${site.city}, with ${pluralize(site.installationCount, 'installation')}.`;

export const answerInactiveSites = async () => {
  const result = await getSites({ status: 'inactive', limit: MAX_SELECT_OPTIONS });
  const sites = result.data;

  const text = sites.length
    ? `${pluralize(sites.length, 'site')} ${sites.length === 1 ? 'is' : 'are'} inactive right now.\n\n${sites
        .map(
          (site) =>
            `${site.name} in ${site.city}, with ${pluralize(site.installationCount, 'installation')}.`
        )
        .join('\n')}`
    : 'Every site is active.';

  return {
    steps: ['Searching sites'],
    text,
    records: sites.map((site) => ({ label: site.name, path: `/sites/${site.id}` })),
    sources: [
      {
        tool: 'searchSites',
        summary: `Found ${pluralize(result.pagination.total, 'inactive site')}`,
      },
    ],
  };
};
