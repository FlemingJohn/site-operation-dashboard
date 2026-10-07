import * as summaryService from '../services/summaryService.js';

export const getSummary = async (req, res) => {
  res.json(await summaryService.getSummary());
};
