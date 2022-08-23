import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
  public static async getResults(req: Request, res: Response) {
    const board = await LeaderboardService.getResults();
    return res.status(200).json(board);
  }
}
