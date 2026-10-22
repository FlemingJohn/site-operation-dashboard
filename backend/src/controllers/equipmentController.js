import * as equipmentService from '../services/equipmentService.js';
import * as serviceRecordService from '../services/serviceRecordService.js';

export const list = async (req, res) => {
  res.json(await equipmentService.findAll(req.validated.query));
};

export const getById = async (req, res) => {
  res.json(await equipmentService.findById(req.validated.params.id));
};

export const recordService = async (req, res) => {
  res
    .status(201)
    .json(await serviceRecordService.create(req.validated.params.id, req.validated.body));
};
