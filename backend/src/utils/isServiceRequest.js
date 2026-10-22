import { timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

export const SERVICE_KEY_HEADER = 'X-Service-Key';

export const isServiceRequest = (req) => {
  const sentKey = req.get(SERVICE_KEY_HEADER);
  if (!env.AI_SERVICE_KEY || !sentKey) return false;

  const expected = Buffer.from(env.AI_SERVICE_KEY);
  const received = Buffer.from(sentKey);
  return expected.length === received.length && timingSafeEqual(expected, received);
};
