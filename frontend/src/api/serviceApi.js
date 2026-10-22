import { EQUIPMENT_DEFAULT_SORT } from '../constants';
import { request } from './client';

export const getServiceDue = (params) =>
  request('/equipment', { params: { ...EQUIPMENT_DEFAULT_SORT, ...params } });

export const markServiceDone = (equipmentId, serviceRecord, idempotencyKey) =>
  request(`/equipment/${equipmentId}/service-records`, {
    method: 'POST',
    body: serviceRecord,
    idempotencyKey,
  });
