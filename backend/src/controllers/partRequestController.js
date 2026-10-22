import * as partRequestService from '../services/partRequestService.js';

export const list = async (req, res) => {
  res.json(await partRequestService.findAll(req.validated.query));
};

export const create = async (req, res) => {
  res.status(201).json(await partRequestService.create(req.validated.body));
};

export const updateStatus = async (req, res) => {
  res.json(await partRequestService.updateStatus(req.validated.params.id, req.validated.body));
};
