import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

export const isAssistantReady = Boolean(env.GEMINI_API_KEY);

export const gemini = isAssistantReady ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;
