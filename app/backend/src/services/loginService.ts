import { compareSync } from 'bcryptjs';
import IUser, { ILogin } from '../interfaces/IUser';
import User from '../database/models/User';
// import ILoginService from '../interfaces/ILoginService';
import HttpException from '../errors/httpException';

export default class LoginService {
  public static async getByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  public static async login(login: ILogin): Promise<IUser> {
    const user = await LoginService.getByEmail(login.email);

    if (!user) throw new HttpException(401, 'Incorrect email or password');

    const checkPassword = compareSync(login.password, user.password);

    if (!checkPassword) throw new HttpException(401, 'Incorrect email or password');

    return user;
  }

  public static async validate(email: string) {
    const user = await LoginService.getByEmail(email);
    if (!user) throw new HttpException(404, 'Email not found');
    return user.role;
  }
}
