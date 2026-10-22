import { request } from './client';

export const getActivity = (params) => request('/activity', { params });

export const getActivityPeople = () => request('/activity/people');
