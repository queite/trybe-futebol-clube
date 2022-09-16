import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IMatch, { ISaveMatchBody } from '../interfaces/IMatch';
import IMatchRepository from '../interfaces/IMatchRepository';

export default class SequelizeMatchRepository implements IMatchRepository {
  findAll = async (): Promise<IMatch[]> => {
    const matches = await Match.findAll(
      {
        include: [
          { model: Team, as: 'teamHome', attributes: ['teamName'] },
          { model: Team, as: 'teamAway', attributes: ['teamName'] },
        ],
      },
    );
    return matches;
  };

  create = async (match: ISaveMatchBody): Promise<IMatch> => {
    const newMatch = await Match.create({ ...match, inProgress: true });
    return newMatch;
  };

  update = async (id: number, update: object): Promise<number> => {
    // query update tem como retorno [1] se o registro é alterado e [0] se já for false ou não houver
    const updated = await Match.update(update, {
      where: { id },
    });
    return updated[0];
  };
}
