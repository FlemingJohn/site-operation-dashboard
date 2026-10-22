const DRAFT_PREFIX = 'draft-';

export const makeDraftChatId = () => `${DRAFT_PREFIX}${crypto.randomUUID()}`;

export const isDraftChatId = (id) => !id || id.startsWith(DRAFT_PREFIX);
