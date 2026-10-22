import { STATUS_LABELS } from '../constants.js';
import { pluralize } from '../utils/pluralize.js';
import * as activityService from './activityService.js';

const toTarget = (site) => ({ label: site.name, path: `/sites/${site.id}` });

export const recordAdded = (client, site) =>
  activityService.record(client, {
    kind: 'site',
    verb: 'added the site',
    target: toTarget(site),
    after: `in ${site.city}`,
    change: [site.status],
  });

export const recordChanged = (client, before, after) => {
  const hasNewStatus = before.status !== after.status;
  return activityService.record(client, {
    kind: 'site',
    verb: hasNewStatus ? 'set' : 'updated the site',
    target: toTarget(after),
    after: hasNewStatus ? `to ${STATUS_LABELS[after.status]}` : null,
    change: hasNewStatus ? [before.status, after.status] : null,
  });
};

export const recordDeleted = (client, site) =>
  activityService.record(client, {
    kind: 'site',
    verb: 'deleted the site',
    target: { label: site.name, path: '/sites' },
    after:
      site.installationCount > 0
        ? `and its ${pluralize(site.installationCount, 'installation')}`
        : null,
  });
