import { getSummary } from '../api/summaryApi';
import { joinLines } from '../lib/joinLines';

const PREVIEW_NOTE =
  'In this preview I can also answer questions about check-ups, spare parts, inactive sites and who has the most work.';

export const answerSummary = async () => {
  const { totals } = await getSummary();
  const intro = [
    `Here is where things stand. ${totals.activeSites} of ${totals.sites} sites are active.`,
    `Of ${totals.installations} installations, ${totals.completedInstallations} are completed,`,
    `${totals.inProgressInstallations} are in progress and ${totals.pendingInstallations} are pending.`,
  ].join(' ');

  return {
    steps: ['Getting the overview numbers'],
    text: joinLines(intro, [PREVIEW_NOTE]),
    records: [{ label: 'Overview', path: '/' }],
    sources: [{ tool: 'getSummary', summary: 'Read the overview totals' }],
  };
};
