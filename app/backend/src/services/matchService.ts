import { ISaveMatchBody } from '../interfaces/IMatch';
import Match from '../database/models/Match';
import Team from '../database/models/Team';
import BadRequestError from '../errors/badRequestError';
import NotFoundError from '../errors/notFoundError';

export default class MatchService {
  public static async getAll():Promise<Match[]> {
    const matches = await Match.findAll(
      {
        include: [
          { model: Team, as: 'teamHome', attributes: ['teamName'] },
          { model: Team, as: 'teamAway', attributes: ['teamName'] },
        ],
      },
    );
    return matches;
  }

  public static async save(match: ISaveMatchBody): Promise<Match> {
    const teams = await Promise.all([match.awayTeam, match.homeTeam]
      .map((team) => Team.findByPk(team)));

    if (teams.includes(null)) throw new NotFoundError('There is no team with such id!');

    const newMatch = await Match.create({ ...match, inProgress: true });
    return newMatch;
  }

  public static async finishMatch(id: number) {
    // query update tem como retorno [1] se o registro é alterado e [0] se já for false ou não houver
    const update = await Match.update({ inProgress: false }, {
      where: { id },
    });
    if (!update) throw new BadRequestError('Match already finished or nonexistent ID');
  }
}
