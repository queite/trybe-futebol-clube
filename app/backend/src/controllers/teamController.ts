import { Request, Response } from 'express';
import TeamService from '../services/teamService';

export default class TeamController {
  constructor(private service: TeamService) {}

  async getAll(req: Request, res: Response) {
    const teams = await this.service.getAll();
    return res.status(200).json(teams);
  }

  async getById(req: Request, res: Response) {
    const team = await this.service.getById(Number(req.params.id));
    return res.status(200).json(team);
  }
}
