import { request } from './client';

export const getSpareParts = (params) => request('/spare-parts', { params });

export const getPartRequests = (params) => request('/part-requests', { params });

export const requestPart = (partRequest, idempotencyKey) =>
  request('/part-requests', { method: 'POST', body: partRequest, idempotencyKey });

export const moveRequest = (id, status) =>
  request(`/part-requests/${id}`, { method: 'PATCH', body: { status } });
