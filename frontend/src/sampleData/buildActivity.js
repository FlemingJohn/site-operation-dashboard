import { EQUIPMENT_TYPE_LABELS } from '../constants';

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600000).toISOString();

const getServiceEvents = (equipment, technicians) =>
  equipment.slice(5, 9).map((unit, index) => ({
    kind: 'service',
    occurredAt: hoursAgo(3 + index * 30),
    actorName: technicians[index % technicians.length].fullName,
    verb: 'recorded a check-up on',
    target: {
      label: `${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial}`,
      path: `/equipment/${unit.id}`,
    },
    after: unit.siteName ? `at ${unit.siteName}` : '',
    note: 'Replaced clamp pads. Next check-up in 90 days.',
  }));

const getPartEvents = (requests) =>
  requests.slice(0, 3).map((request, index) => ({
    kind: 'part',
    occurredAt: hoursAgo(6 + index * 26),
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

export const buildActivity = ({ sites, equipment, technicians, partRequests }) => {
  if (!technicians.length) return [];
  const admin = technicians[0].fullName;
  return [
    ...getServiceEvents(equipment, technicians),
    ...getPartEvents(partRequests),
    ...getSiteEvents(sites, admin),
  ].map((event, index) => ({ id: index + 1, ...event }));
};
