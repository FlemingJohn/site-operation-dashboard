import { MAX_SELECT_OPTIONS } from '../constants';
import { request } from './client';

export const getUsers = (params) => request('/users', { params });

export const getTechnicians = () =>
  getUsers({ role: 'technician', limit: MAX_SELECT_OPTIONS }).then((result) => result.data);

export const createUser = (user, idempotencyKey) =>
  request('/users', { method: 'POST', body: user, idempotencyKey });
