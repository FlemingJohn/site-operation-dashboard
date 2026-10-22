import { request } from './client';

export const getEquipment = (params) => request('/equipment', { params });

export const getEquipmentUnit = (id) => request(`/equipment/${id}`);
