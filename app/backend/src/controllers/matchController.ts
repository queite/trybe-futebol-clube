import { Request, Response } from 'express';
import HttpException from '../errors/httpException';
import MatchService from '../services/matchService';

export default class MatchController {
  public static async getAll(req: Request, res: Response) {
    const teams = await MatchService.getAll();
    return res.status(200).json(teams);
  }

  public static async save(req: Request, res: Response) {
    if (req.body.homeTeam === req.body.awayTeam) {
      throw new HttpException(401, 'It is not possible to create a match with two equal teams');
    }

    const newMatch = await MatchService.save(req.body);
    return res.status(201).json(newMatch);
  }

  public static async finishMatch(req: Request, res: Response) {
    await MatchService.finishMatch(Number(req.params.id));
    return res.status(200).json({ message: 'Finished' });
  }

  public static async updateMatch(req: Request, res: Response) {
    await MatchService.updateMatch(Number(req.params.id), req.body);
    return res.status(200).json({ message: 'Match updated' });
  }
}
