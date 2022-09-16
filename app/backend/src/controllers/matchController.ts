import { Request, Response } from 'express';
import HttpException from '../errors/httpException';
import MatchService from '../services/matchService';

export default class MatchController {
  constructor(private service: MatchService) {}

  async getAll(req: Request, res: Response) {
    const matches = await this.service.getAll();
    return res.status(200).json(matches);
  }

  async save(req: Request, res: Response) {
    if (req.body.homeTeam === req.body.awayTeam) {
      throw new HttpException(401, 'It is not possible to create a match with two equal teams');
    }

    const newMatch = await this.service.save(req.body);
    return res.status(201).json(newMatch);
  }

  async finishMatch(req: Request, res: Response) {
    await this.service.finishMatch(Number(req.params.id));
    return res.status(200).json({ message: 'Finished' });
  }

  async updateMatch(req: Request, res: Response) {
    await this.service.updateMatch(Number(req.params.id), req.body);
    return res.status(200).json({ message: 'Match updated' });
  }
}
