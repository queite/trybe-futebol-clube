import { compareSync } from 'bcryptjs';
import IUser, { ILogin } from '../interfaces/IUser';
import User from '../database/models/User';
import ILoginService from '../interfaces/ILoginService';
import UnauthorizedError from '../errors/unauthorizedError';

export default class LoginService implements ILoginService<IUser> {
  public login = async (login: ILogin): Promise<IUser> => {
    const user = await User.findOne({ where: { email: login.email } });

    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const checkPassword = compareSync(login.password, user.password);

    if (!checkPassword) throw new UnauthorizedError('Incorrect email or password');

    return user;
  };
}
