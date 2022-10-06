import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
  constructor(private service: LeaderboardService) {}

  async getResultsHomeTeams(req: Request, res: Response) {
    const board = await this.service.getResults('home');
    return res.status(200).json(board);
  }

  async getResultsAwayTeams(req: Request, res: Response) {
    const board = await this.service.getResults('away');
    return res.status(200).json(board);
  }

  async getResults(req: Request, res: Response) {
    const board = await this.service.getTotalResults();
    return res.status(200).json(board);
  }
}
