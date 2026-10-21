import { EQUIPMENT_TYPE_LABELS } from '../constants';

const SERVICE_EVENT_COUNT = 4;

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600000).toISOString();

const atTime = (date, hour) =>
  new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`).toISOString();

const byLatestService = (first, second) => second.lastServiceOn.localeCompare(first.lastServiceOn);

const findLatestNote = (serviceRecords, unit) =>
  serviceRecords.find(
    (record) => record.equipmentId === unit.id && record.doneOn === unit.lastServiceOn
  )?.notes;

const getServiceEvents = (equipment, serviceRecords) =>
  [...equipment]
    .sort(byLatestService)
    .slice(0, SERVICE_EVENT_COUNT)
    .map((unit, index) => ({
      kind: 'service',
      occurredAt: atTime(unit.lastServiceOn, 10 + index),
      actorName: unit.lastServiceBy,
      verb: 'recorded a check-up on',
      target: {
        label: `${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial}`,
        path: `/equipment/${unit.id}`,
      },
      after: unit.siteName ? `at ${unit.siteName}` : '',
      note: findLatestNote(serviceRecords, unit),
    }));

const getPartEvents = (requests) =>
  requests.slice(0, 3).map((request, index) => ({
    kind: 'part',
    occurredAt: atTime(request.requestedOn, 9 + index),
    actorName: request.requestedBy,
    verb: 'asked for',
    target: { label: `${request.quantity} × ${request.partName}`, path: '/spare-parts' },
    after: `for ${request.serial}`,
    change: [request.status],
  }));

const getSiteEvents = (sites, admin) =>
  sites
    .filter((site) => site.status === 'inactive')
    .map((site, index) => ({
      kind: 'site',
      occurredAt: hoursAgo(9 + index * 40),
      actorName: admin,
      verb: 'set',
      target: { label: site.name, path: `/sites/${site.id}` },
      after: 'to Inactive',
      change: ['active', 'inactive'],
    }));

export const buildActivity = ({ sites, equipment, serviceRecords, technicians, partRequests }) => {
  if (!technicians.length) return [];
  const admin = technicians[0].fullName;
  return [
    ...getServiceEvents(equipment, serviceRecords),
    ...getPartEvents(partRequests),
    ...getSiteEvents(sites, admin),
  ].map((event, index) => ({ id: index + 1, ...event }));
};
