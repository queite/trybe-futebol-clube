import MatchService from '../services/matchService';
import SequelizeMatchRepository from '../repositories/SequelizeMatchRepository';
import MatchController from '../controllers/matchController';

export default class MatchFactory {
  static make() {
    const repository = new SequelizeMatchRepository();
    const service = new MatchService(repository);
    const controller = new MatchController(service);

    return controller;
  }
}
