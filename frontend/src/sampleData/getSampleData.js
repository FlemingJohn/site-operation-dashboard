import { getSites } from '../api/siteApi';
import { getTechnicians } from '../api/userApi';
import { MAX_SELECT_OPTIONS } from '../constants';
import { buildActivity } from './buildActivity';
import { buildEquipment } from './buildEquipment';
import { buildPartRequests } from './buildPartRequests';
import { buildServiceRecords } from './buildServiceRecords';
import { buildSpareParts } from './buildSpareParts';

let sampleData;

const loadSampleData = async () => {
  const [siteResult, technicians] = await Promise.all([
    getSites({ limit: MAX_SELECT_OPTIONS }),
    getTechnicians(),
  ]);
  const sites = siteResult.data;
  const equipment = buildEquipment(sites, technicians);
  const spareParts = buildSpareParts();
  const partRequests = buildPartRequests(equipment, spareParts, technicians);

  return {
    sites,
    technicians,
    equipment,
    serviceRecords: buildServiceRecords(equipment),
    spareParts,
    partRequests,
    activity: buildActivity({ sites, equipment, technicians, partRequests }),
  };
};

export const getSampleData = () => {
  sampleData ??= loadSampleData().catch((error) => {
    sampleData = undefined;
    throw error;
  });
  return sampleData;
};
