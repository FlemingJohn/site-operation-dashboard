import { request } from './client';

export const getTechnicians = () => request('/users', { params: { role: 'technician' } });
