import { compareSync } from 'bcryptjs';
import IUser, { ILogin } from '../interfaces/IUser';
import User from '../database/models/User';
// import ILoginService from '../interfaces/ILoginService';
import UnauthorizedError from '../errors/unauthorizedError';

export default class LoginService {
  public static async getByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  public static async login(login: ILogin): Promise<IUser> {
    const user = await LoginService.getByEmail(login.email);

    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const checkPassword = compareSync(login.password, user.password);

    if (!checkPassword) throw new UnauthorizedError('Incorrect email or password');

    return user;
  }

  public static async validate(email: string) {
    const user = await LoginService.getByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid  token');
    return user.role;
  }
}
