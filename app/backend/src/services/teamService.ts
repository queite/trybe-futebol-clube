import ITeam from '../interfaces/ITeam';
import Team from '../database/models/Team';
import HttpException from '../errors/httpException';

export default class TeamService {
  public static async getAll(): Promise<ITeam[]> {
    const teams = await Team.findAll();
    return teams;
  }

  public static async getById(id: number): Promise<ITeam> {
    const team = await Team.findByPk(id);
    if (!team) throw new HttpException(404, 'ID not found');
    return team;
  }
}
