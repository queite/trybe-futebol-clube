import LeaderboardController from '../controllers/leaderboardController';
import SequelizeMatchRepository from '../repositories/SequelizeMatchRepository';
import LeaderboardService from '../services/leaderboardService';
import SequelizeTeamRepository from '../repositories/SequelizeTeamRepository';

export default class LeaderboardFactory {
  static make() {
    const teamRepository = new SequelizeTeamRepository();
    const matchRepository = new SequelizeMatchRepository();
    const service = new LeaderboardService(matchRepository, teamRepository);
    const controller = new LeaderboardController(service);

    return controller;
  }
}
