import { request } from './client';

export const getSpareParts = (params) => request('/spare-parts', { params });

export const getSparePartCounts = (params) => request('/spare-parts/counts', { params });

export const getSparePart = (id) => request(`/spare-parts/${id}`);

export const createSparePart = (part, idempotencyKey) =>
  request('/spare-parts', { method: 'POST', body: part, idempotencyKey });

export const updateSparePart = (id, part) =>
  request(`/spare-parts/${id}`, { method: 'PUT', body: part });

export const setPartStock = (id, stock, reason) =>
  request(`/spare-parts/${id}/stock`, { method: 'PATCH', body: { stock, reason } });

export const deleteSparePart = (id) => request(`/spare-parts/${id}`, { method: 'DELETE' });

export const getPartRequests = (params) => request('/part-requests', { params });

export const requestPart = (partRequest, idempotencyKey) =>
  request('/part-requests', { method: 'POST', body: partRequest, idempotencyKey });

export const moveRequest = (id, status) =>
  request(`/part-requests/${id}`, { method: 'PATCH', body: { status } });
