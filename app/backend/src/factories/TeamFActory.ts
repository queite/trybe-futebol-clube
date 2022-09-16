import TeamService from '../services/teamService';
import SequelizeTeamRepository from '../repositories/SequelizeTeamRepository';
import TeamController from '../controllers/teamController';

export default class TeamFactory {
  static make() {
    const repository = new SequelizeTeamRepository();
    const service = new TeamService(repository);
    const controller = new TeamController(service);

    return controller;
  }
}
