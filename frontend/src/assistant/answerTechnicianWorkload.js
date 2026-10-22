import { getInstallations } from '../api/installationApi';
import { MAX_SELECT_OPTIONS } from '../constants';
import { joinLines } from '../lib/joinLines';
import { pluralize } from '../lib/pluralize';

const OPEN_STATUSES = ['pending', 'in_progress'];

const countByTechnician = (installations) =>
  installations.reduce((counts, installation) => {
    const name = installation.technicianName ?? 'Not assigned';
    counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});

export const answerTechnicianWorkload = async () => {
  const results = await Promise.all(
    OPEN_STATUSES.map((status) => getInstallations({ status, limit: MAX_SELECT_OPTIONS }))
  );
  const openInstallations = results.flatMap((result) => result.data);
  const ranking = Object.entries(countByTechnician(openInstallations)).sort(
    (first, second) => second[1] - first[1]
  );

  const text = ranking.length
    ? `${ranking[0][0]} has the most open work.\n\n${ranking
        .map(([name, count]) => `${name}: ${pluralize(count, 'open installation')}.`)
        .join('\n')}`
    : 'No technician has open installations.';

  return {
    steps: ['Counting open installations for each technician'],
    text,
    records: ranking.length ? [{ label: 'Installations', path: '/installations' }] : [],
    sources: [
      {
        tool: 'getTechnicianWorkload',
        summary: `Looked at ${pluralize(openInstallations.length, 'open installation')}`,
      },
    ],
  };
};
