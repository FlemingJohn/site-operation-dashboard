import { request } from './client';

export const getEquipment = (params) => request('/equipment', { params });

export const getEquipmentCounts = (params) => request('/equipment/counts', { params });

export const getEquipmentUnit = (id) => request(`/equipment/${id}`);

export const createEquipment = (machine, idempotencyKey) =>
  request('/equipment', { method: 'POST', body: machine, idempotencyKey });

export const updateEquipment = (id, machine) =>
  request(`/equipment/${id}`, { method: 'PUT', body: machine });

export const deleteEquipment = (id) => request(`/equipment/${id}`, { method: 'DELETE' });
