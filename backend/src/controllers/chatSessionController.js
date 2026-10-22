import * as chatMessageService from '../services/chatMessageService.js';
import * as chatSessionService from '../services/chatSessionService.js';

export const list = async (req, res) => {
  res.json(await chatSessionService.findAll(req.visitorId));
};

export const listMessages = async (req, res) => {
  const session = await chatSessionService.findOwned(req.visitorId, req.validated.params.id);
  res.json(await chatMessageService.findBySession(session.id));
};

export const rename = async (req, res) => {
  const { params, body } = req.validated;
  res.json(await chatSessionService.rename(req.visitorId, params.id, body.title));
};

export const remove = async (req, res) => {
  await chatSessionService.remove(req.visitorId, req.validated.params.id);
  res.status(204).end();
};

export const removeAll = async (req, res) => {
  res.json(await chatSessionService.removeAll(req.visitorId));
};
