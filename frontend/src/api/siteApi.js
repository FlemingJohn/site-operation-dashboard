import { request } from './client';

export const getSites = (params) => request('/sites', { params });

export const getSite = (id) => request(`/sites/${id}`);

export const createSite = (site, idempotencyKey) =>
  request('/sites', { method: 'POST', body: site, idempotencyKey });

export const updateSite = (id, site) => request(`/sites/${id}`, { method: 'PUT', body: site });

export const deleteSite = (id) => request(`/sites/${id}`, { method: 'DELETE' });
