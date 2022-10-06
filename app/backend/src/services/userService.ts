import { compareSync } from 'bcryptjs';
import IUser, { ILogin } from '../interfaces/IUser';
import HttpException from '../errors/httpException';
import IUserRepository from '../interfaces/IUserRepository';

export default class UserService {
  constructor(private repo: IUserRepository) {}

  async getByEmail(email: string): Promise<IUser | null> {
    return this.repo.findOne(email);
  }

  async login(login: ILogin): Promise<IUser> {
    const user = await this.getByEmail(login.email);

    if (!user) throw new HttpException(401, 'Incorrect email or password');

    const checkPassword = compareSync(login.password, user.password);

    if (!checkPassword) throw new HttpException(401, 'Incorrect email or password');

    return user;
  }

  async validate(email: string): Promise<string> {
    const user = await this.getByEmail(email);
    if (!user) throw new HttpException(404, 'Email not found');
    return user.role;
  }
}
