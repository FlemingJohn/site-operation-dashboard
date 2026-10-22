import * as sparePartService from '../services/sparePartService.js';

export const list = async (req, res) => {
  res.json(await sparePartService.findAll(req.validated.query));
};
