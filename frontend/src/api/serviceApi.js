import { EQUIPMENT_TYPE_LABELS, SAMPLE_DELAY_MS, SERVICE_INTERVAL_DAYS } from '../constants';
import { addDays } from '../lib/addDays';
import { getServiceState } from '../lib/getServiceState';
import { wait } from '../lib/wait';
import { getSampleData } from '../sampleData/getSampleData';

export const getServiceDue = async () => {
  const { equipment } = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  return [...equipment]
    .sort((first, second) => first.nextServiceOn.localeCompare(second.nextServiceOn))
    .map((unit) => ({ ...unit, serviceState: getServiceState(unit.nextServiceOn) }));
};

export const markServiceDone = async (equipmentId, { doneOn, doneBy, notes }) => {
  const data = await getSampleData();
  await wait(SAMPLE_DELAY_MS);
  const unit = data.equipment.find((item) => item.id === equipmentId);
  unit.lastServiceOn = doneOn;
  unit.lastServiceBy = doneBy;
  unit.nextServiceOn = addDays(doneOn, SERVICE_INTERVAL_DAYS);
  data.serviceRecords.unshift({ id: Date.now(), equipmentId, doneOn, doneBy, notes });
  data.activity.unshift({
    id: Date.now(),
    kind: 'service',
    occurredAt: new Date().toISOString(),
    actorName: doneBy,
    verb: 'recorded a check-up on',
    target: {
      label: `${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial}`,
      path: `/equipment/${unit.id}`,
    },
    after: unit.siteName ? `at ${unit.siteName}` : '',
    note: notes || undefined,
  });
  return unit;
};
