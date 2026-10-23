import * as sparePartService from '../services/sparePartService.js';

export const list = async (req, res) => {
  res.json(await sparePartService.findAll(req.validated.query));
};

export const getById = async (req, res) => {
  res.json(await sparePartService.findById(req.validated.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await sparePartService.create(req.validated.body));
};

export const update = async (req, res) => {
  res.json(await sparePartService.update(req.validated.params.id, req.validated.body));
};

export const setStock = async (req, res) => {
  res.json(await sparePartService.setStock(req.validated.params.id, req.validated.body));
};

export const remove = async (req, res) => {
  await sparePartService.remove(req.validated.params.id);
  res.status(204).end();
};

export const counts = async (req, res) => {
  res.json(await sparePartService.countAll(req.validated.query));
};
