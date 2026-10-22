import { EQUIPMENT_TYPE_LABELS, MESSAGES, SERVICE_INTERVAL_DAYS } from '../constants.js';
import { HttpError } from '../utils/HttpError.js';
import { withTransaction } from '../utils/withTransaction.js';
import * as activityService from './activityService.js';
import * as equipmentService from './equipmentService.js';

export const create = (equipmentId, { doneOn, technicianId, notes }) =>
  withTransaction(async (client) => {
    await lockEquipment(client, equipmentId);
    const { rows } = await client.query(
      `INSERT INTO service_records (equipment_id, technician_id, done_on, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING (SELECT full_name FROM users WHERE id = $2) AS "technicianName"`,
      [equipmentId, technicianId, doneOn, notes]
    );
    await client.query(`UPDATE equipment SET next_service_on = $1::date + $2::int WHERE id = $3`, [
      doneOn,
      SERVICE_INTERVAL_DAYS,
      equipmentId,
    ]);

    const unit = await equipmentService.findSummary(equipmentId, client);
    await recordServiceEvent(client, unit, rows[0].technicianName, notes);
    return unit;
  });

const lockEquipment = async (client, equipmentId) => {
  const { rowCount } = await client.query('SELECT id FROM equipment WHERE id = $1 FOR UPDATE', [
    equipmentId,
  ]);
  if (rowCount === 0) throw new HttpError(404, MESSAGES.equipmentNotFound);
};

const recordServiceEvent = (client, unit, technicianName, notes) =>
  activityService.record(client, {
    kind: 'service',
    actorName: technicianName,
    verb: 'recorded a check-up on',
    target: {
      label: `${EQUIPMENT_TYPE_LABELS[unit.type]} ${unit.serial}`,
      path: `/equipment/${unit.id}`,
    },
    after: unit.siteName ? `at ${unit.siteName}` : null,
    note: notes,
  });
