import { EQUIPMENT_TYPE_LABELS, STATUS_LABELS } from '../constants.js';
import * as activityService from './activityService.js';

const EQUIPMENT_LIST_PATH = '/equipment';

const toTarget = (unit) => ({
  label: `${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial}`,
  path: `/equipment/${unit.id}`,
});

const describePlace = (unit) => (unit.siteName ? `at ${unit.siteName}` : 'in the warehouse');

export const recordAdded = (client, unit) =>
  activityService.record(client, {
    kind: 'machine',
    verb: 'added the machine',
    target: toTarget(unit),
    after: describePlace(unit),
    change: [unit.status],
  });

export const recordChanged = (client, before, after) => {
  const hasNewStatus = before.status !== after.status;
  return activityService.record(client, {
    kind: 'machine',
    verb: hasNewStatus ? 'set' : 'updated the machine',
    target: toTarget(after),
    after: hasNewStatus
      ? `to ${STATUS_LABELS[after.status]}, ${describePlace(after)}`
      : describePlace(after),
    change: hasNewStatus ? [before.status, after.status] : null,
  });
};

export const recordDeleted = (client, unit) =>
  activityService.record(client, {
    kind: 'machine',
    verb: 'deleted the machine',
    target: { label: toTarget(unit).label, path: EQUIPMENT_LIST_PATH },
    after: describePlace(unit),
  });

export const unlinkMachinePage = (client, unit) =>
  activityService.moveTargetPath(client, toTarget(unit).path, EQUIPMENT_LIST_PATH);
