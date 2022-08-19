import { Request, Response } from 'express';
import MatchService from '../services/matchService';

export default class MatchController {
  public getAll = async (req: Request, res: Response) => {
    const teams = await MatchService.getAll();
    return res.status(200).json(teams);
  };
}
