import * as summaryService from '../../services/summaryService.js';

export const getSummaryTool = {
  declaration: {
    name: 'getSummary',
    description:
      'Overall totals: number of sites, active sites, installations by status and installations per month.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  stepLabel: 'Getting the overview numbers',
  run: async () => {
    const { totals, statusBreakdown, monthlyInstallations } = await summaryService.getSummary();
    return {
      response: { totals, statusBreakdown, monthlyInstallations },
      records: [{ label: 'Overview', path: '/' }],
      summary: 'Read the overview totals',
    };
  },
};
