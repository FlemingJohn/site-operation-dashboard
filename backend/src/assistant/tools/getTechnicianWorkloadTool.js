import * as summaryService from '../../services/summaryService.js';

const toWorkload = ({ label, pending, inProgress, completed }) => ({
  technician: label,
  open: pending + inProgress,
  pending,
  inProgress,
  completed,
});

const byMostOpen = (first, second) => second.open - first.open;

export const getTechnicianWorkloadTool = {
  declaration: {
    name: 'getTechnicianWorkload',
    description:
      'Installations per technician. open = pending + in progress, which is the work still to do. completed is finished work. Sorted by most open work first.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  stepLabel: 'Counting work for each technician',
  run: async () => {
    const { installationsByTechnician } = await summaryService.getSummary();
    const technicians = installationsByTechnician.map(toWorkload).sort(byMostOpen);
    return {
      response: { technicians },
      records: [{ label: 'Installations', path: '/installations' }],
      summary: `Looked at ${technicians.length} technicians`,
    };
  },
};
