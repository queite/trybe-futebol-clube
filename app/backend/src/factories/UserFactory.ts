import UserService from '../services/userService';
import SequelizeUserRepository from '../repositories/SequelizeUserRepository';
import UserController from '../controllers/userController';

export default class UserFactory {
  static make() {
    const repository = new SequelizeUserRepository();
    const service = new UserService(repository);
    const controller = new UserController(service);

    return controller;
  }
}
