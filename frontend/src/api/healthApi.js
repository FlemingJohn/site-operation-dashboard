import { request } from './client';

const HEALTH_TIMEOUT_MS = 30000;

export const getHealth = () => request('/health', { timeoutMs: HEALTH_TIMEOUT_MS });

export const getAssistantStatus = () =>
  request('/assistant/status', { timeoutMs: HEALTH_TIMEOUT_MS });
