import Team from '../database/models/Team';
import ITeam from '../interfaces/ITeam';
import ITeamRepository from '../interfaces/ITeamRepository';

export default class SequelizeTeamRepository implements ITeamRepository {
  findAll = async (): Promise<ITeam[]> => Team.findAll();

  findById = async (id: number): Promise<ITeam | null> => Team.findByPk(id);
}
