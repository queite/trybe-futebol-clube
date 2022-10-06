import User from '../database/models/User';
import IUser from '../interfaces/IUser';
import IUserRepository from '../interfaces/IUserRepository';

export default class SequelizeUserRepository implements IUserRepository {
  findOne = async (email: string): Promise<IUser | null> => User.findOne({ where: { email } });
}
