import * as siteService from '../services/siteService.js';

export const list = async (req, res) => {
  res.json(await siteService.findAll(req.validated.query));
};

export const getById = async (req, res) => {
  res.json(await siteService.findById(req.validated.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await siteService.create(req.validated.body));
};

export const update = async (req, res) => {
  res.json(await siteService.update(req.validated.params.id, req.validated.body));
};

export const remove = async (req, res) => {
  await siteService.remove(req.validated.params.id);
  res.status(204).end();
};
