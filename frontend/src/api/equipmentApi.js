import { SAMPLE_DELAY_MS } from '../constants';
import { getServiceState } from '../lib/getServiceState';
import { includesText } from '../lib/includesText';
import { paginateItems } from '../lib/paginateItems';
import { sortItems } from '../lib/sortItems';
import { wait } from '../lib/wait';
import { getSampleData } from '../sampleData/getSampleData';

const withServiceState = (unit) => ({ ...unit, serviceState: getServiceState(unit.nextServiceOn) });

const matchesFilters = (unit, { search, type, status, siteId }) =>
  includesText([unit.serial, unit.siteName], search) &&
  (!type || unit.type === type) &&
  (!status || unit.status === status) &&
  (!siteId || String(unit.siteId) === String(siteId));

export const getEquipment = async (params = {}) => {
  const { equipment } = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const matches = equipment.filter((unit) => matchesFilters(unit, params)).map(withServiceState);
  return paginateItems(sortItems(matches, params), params);
};

export const getEquipmentUnit = async (id) => {
  const { equipment, serviceRecords, partRequests } = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const unit = equipment.find((item) => String(item.id) === String(id));
  if (!unit) throw new Error('This machine no longer exists.');
  return {
    ...withServiceState(unit),
    serviceRecords: serviceRecords.filter((record) => record.equipmentId === unit.id),
    partRequests: partRequests.filter((request) => request.equipmentId === unit.id),
  };
};
