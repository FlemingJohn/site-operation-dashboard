import * as userService from '../services/userService.js';

export const list = async (req, res) => {
  res.json(await userService.findAll(req.validated.query));
};

export const create = async (req, res) => {
  res.status(201).json(await userService.create(req.validated.body));
};

export const counts = async (req, res) => {
  res.json(await userService.countAll(req.validated.query));
};
