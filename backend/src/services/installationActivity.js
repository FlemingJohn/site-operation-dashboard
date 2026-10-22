import { STATUS_LABELS } from '../constants.js';
import * as activityService from './activityService.js';

const toTarget = (installation) => ({
  label: installation.equipment,
  path: `/sites/${installation.siteId}`,
});

export const recordAdded = (client, installation) =>
  activityService.record(client, {
    kind: 'installation',
    verb: 'added the installation',
    target: toTarget(installation),
    after: `at ${installation.siteName}`,
    change: [installation.status],
  });

export const recordChanged = (client, before, after) => {
  const hasNewStatus = before.status !== after.status;
  return activityService.record(client, {
    kind: 'installation',
    verb: hasNewStatus ? 'moved the installation' : 'updated the installation',
    target: toTarget(after),
    after: hasNewStatus
      ? `at ${after.siteName} to ${STATUS_LABELS[after.status]}`
      : `at ${after.siteName}`,
    change: hasNewStatus ? [before.status, after.status] : null,
  });
};

export const recordDeleted = (client, installation) =>
  activityService.record(client, {
    kind: 'installation',
    verb: 'deleted the installation',
    target: toTarget(installation),
    after: `at ${installation.siteName}`,
  });
