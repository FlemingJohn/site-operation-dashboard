import * as activityService from '../services/activityService.js';

export const list = async (req, res) => {
  res.json(await activityService.findAll(req.validated.query));
};

export const listPeople = async (req, res) => {
  res.json(await activityService.findPeople());
};
