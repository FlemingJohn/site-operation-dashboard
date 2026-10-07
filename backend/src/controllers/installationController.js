import * as installationService from '../services/installationService.js';

export const list = async (req, res) => {
  res.json(await installationService.findAll(req.validated.query));
};

export const getById = async (req, res) => {
  res.json(await installationService.findById(req.validated.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await installationService.create(req.validated.body));
};

export const update = async (req, res) => {
  res.json(await installationService.update(req.validated.params.id, req.validated.body));
};

export const remove = async (req, res) => {
  await installationService.remove(req.validated.params.id);
  res.status(204).end();
};
