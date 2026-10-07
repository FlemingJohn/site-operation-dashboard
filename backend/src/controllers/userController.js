import * as userService from '../services/userService.js';

export const list = async (req, res) => {
  res.json(await userService.findAll(req.validated.query));
};
