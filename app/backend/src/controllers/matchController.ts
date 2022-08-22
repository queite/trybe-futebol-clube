import { Request, Response } from 'express';
import MatchService from '../services/matchService';

export default class MatchController {
  public static async getAll(req: Request, res: Response) {
    const teams = await MatchService.getAll();
    return res.status(200).json(teams);
  }

  public static async save(req: Request, res: Response) {
    const newMatch = await MatchService.save(req.body);
    return res.status(201).json(newMatch);
  }

  public static async finishMatch(req: Request, res: Response) {
    await MatchService.finishMatch(Number(req.params.id));
    return res.status(200).json({ message: 'Finished' });
  }
}
