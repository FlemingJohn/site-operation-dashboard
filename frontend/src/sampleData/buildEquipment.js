import { SERVICE_INTERVAL_DAYS } from '../constants';
import { addDays } from '../lib/addDays';
import { getToday } from '../utils';

const UNITS = [
  ['blade_yoke', 'BY-204', -19, 'deployed'],
  ['tower_gripper', 'TG-11', -16, 'deployed'],
  ['tagline_system', 'TL-88', 3, 'deployed'],
  ['blade_yoke', 'BY-206', 6, 'deployed'],
  ['tagline_system', 'TL-90', -4, 'deployed'],
  ['blade_yoke', 'BY-207', 15, 'deployed'],
  ['tower_gripper', 'TG-12', 58, 'deployed'],
  ['mobile_robot', 'MR-3', 50, 'in_service'],
  ['mobile_robot', 'MR-4', 72, 'deployed'],
  ['tagline_system', 'TL-91', 88, 'deployed'],
  ['blade_yoke', 'BY-205', 41, 'in_stock'],
  ['tower_gripper', 'TG-13', 24, 'in_stock'],
];

const pickSite = (sites, index, status) =>
  status === 'in_stock' ? null : sites[index % sites.length];

export const buildEquipment = (sites, technicians) =>
  UNITS.map(([type, serial, dueInDays, status], index) => {
    const site = sites.length ? pickSite(sites, index, status) : null;
    const nextServiceOn = addDays(getToday(), dueInDays);
    return {
      id: index + 1,
      serial,
      type,
      status: site || status === 'in_stock' ? status : 'in_stock',
      siteId: site?.id ?? null,
      siteName: site?.name ?? null,
      nextServiceOn,
      lastServiceOn: addDays(nextServiceOn, -SERVICE_INTERVAL_DAYS),
      lastServiceBy: technicians[index % Math.max(technicians.length, 1)]?.fullName ?? null,
    };
  });
