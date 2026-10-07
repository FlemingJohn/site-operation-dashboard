import { request } from './client';

export const getInstallations = (params) => request('/installations', { params });

export const getInstallation = (id) => request(`/installations/${id}`);

export const createInstallation = (installation, idempotencyKey) =>
  request('/installations', { method: 'POST', body: installation, idempotencyKey });

export const updateInstallation = (id, installation) =>
  request(`/installations/${id}`, { method: 'PUT', body: installation });

export const deleteInstallation = (id) => request(`/installations/${id}`, { method: 'DELETE' });
