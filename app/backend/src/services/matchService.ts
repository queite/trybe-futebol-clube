import IMatch, { IGoals, ISaveMatchBody } from '../interfaces/IMatch';
import Team from '../database/models/Team';
import HttpException from '../errors/httpException';
import IMatchRepository from '../interfaces/IMatchRepository';

export default class MatchService {
  constructor(private repository: IMatchRepository) {}

  async getAll():Promise<IMatch[]> {
    const matches = await this.repository.findAll();
    return matches;
  }

  async save(match: ISaveMatchBody): Promise<IMatch> {
    const teams = await Promise.all([match.awayTeam, match.homeTeam]
      .map((team) => Team.findByPk(team)));

    if (teams.includes(null)) throw new HttpException(404, 'There is no team with such id!');

    const newMatch = await this.repository.create({ ...match, inProgress: true });
    return newMatch;
  }

  async finishMatch(id: number) {
    const result = await this.repository.update(id, { inProgress: false });
    if (!result) throw new HttpException(400, 'Match already finished or nonexistent ID');
  }

  async updateMatch(id: number, body: IGoals) {
    const update = await this.repository.update(id, body);
    if (!update) throw new HttpException(400, 'Something went wrong');
  }
}
