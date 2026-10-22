import { getServiceDue } from '../api/serviceApi';
import { EQUIPMENT_TYPE_LABELS } from '../constants';
import { describeServiceDue } from '../lib/describeServiceDue';
import { joinLines } from '../lib/joinLines';
import { pluralize } from '../lib/pluralize';

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

const describeUnit = (unit) =>
  `${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial} at ${unit.siteName ?? 'the warehouse'}: ${lowerFirst(describeServiceDue(unit.nextServiceOn))}.`;

export const answerServiceDue = async () => {
  const units = await getServiceDue();
  const urgent = units.filter((unit) => unit.serviceState !== 'later');
  const late = urgent.filter((unit) => unit.serviceState === 'late');

  const intro = `${pluralize(urgent.length, 'machine')} need a check-up soon, and ${late.length} of them are already late.`;
  const text = urgent.length
    ? joinLines(intro, urgent.map(describeUnit))
    : 'No machine needs a check-up in the next 7 days.';

  return {
    steps: ['Checking which machines are due a check-up'],
    text,
    records: urgent.map((unit) => ({ label: unit.serial, path: `/equipment/${unit.id}` })),
    sources: [
      { tool: 'listServiceDue', summary: `Looked at ${pluralize(units.length, 'machine')}` },
    ],
  };
};
