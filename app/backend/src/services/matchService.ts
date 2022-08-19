// import IMatch from '../interfaces/IMatch';
import Match from '../database/models/Match';
import Team from '../database/models/Team';

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
}
