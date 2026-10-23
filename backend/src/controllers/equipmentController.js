import * as equipmentService from '../services/equipmentService.js';
import * as serviceRecordService from '../services/serviceRecordService.js';

export const list = async (req, res) => {
  res.json(await equipmentService.findAll(req.validated.query));
};

export const getById = async (req, res) => {
  res.json(await equipmentService.findById(req.validated.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await equipmentService.create(req.validated.body));
};

export const update = async (req, res) => {
  res.json(await equipmentService.update(req.validated.params.id, req.validated.body));
};

export const remove = async (req, res) => {
  await equipmentService.remove(req.validated.params.id);
  res.status(204).end();
};

export const recordService = async (req, res) => {
  res
    .status(201)
    .json(await serviceRecordService.create(req.validated.params.id, req.validated.body));
};

export const counts = async (req, res) => {
  res.json(await equipmentService.countAll(req.validated.query));
};
