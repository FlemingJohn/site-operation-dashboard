import { SERVICE_INTERVAL_DAYS } from '../constants';
import { addDays } from '../lib/addDays';

const NOTES = ['Replaced clamp pads', 'Annual inspection', 'Hydraulic check', 'Calibrated sensors'];
const RECORDS_PER_UNIT = 3;

export const buildServiceRecords = (equipment) =>
  equipment.flatMap((unit) =>
    Array.from({ length: RECORDS_PER_UNIT }, (_, step) => ({
      id: unit.id * 10 + step,
      equipmentId: unit.id,
      doneOn: addDays(unit.lastServiceOn, -SERVICE_INTERVAL_DAYS * step),
      doneBy: unit.lastServiceBy,
      notes: NOTES[(unit.id + step) % NOTES.length],
    }))
  );
