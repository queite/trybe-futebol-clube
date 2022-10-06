import ITeam from '../interfaces/ITeam';
import HttpException from '../errors/httpException';
import ITeamRepository from '../interfaces/ITeamRepository';

export default class TeamService {
  constructor(private repository: ITeamRepository) {}

  async getAll(): Promise<ITeam[]> {
    return this.repository.findAll();
  }

  async getById(id: number): Promise<ITeam> {
    const team = await this.repository.findById(id);
    if (!team) throw new HttpException(404, 'ID not found');
    return team;
  }
}
