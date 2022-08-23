import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
  public static async getResultsHomeTeams(req: Request, res: Response) {
    const board = await LeaderboardService.getResults('home');
    return res.status(200).json(board);
  }

  public static async getResultsAwayTeams(req: Request, res: Response) {
    const board = await LeaderboardService.getResults('away');
    return res.status(200).json(board);
  }

  public static async getResults(req: Request, res: Response) {
    const board = await LeaderboardService.getTotalResults();
    return res.status(200).json(board);
  }
}
