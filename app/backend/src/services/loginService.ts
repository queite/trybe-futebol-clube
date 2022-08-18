import IUser, { ILogin } from '../interfaces/IUser';
import User from '../database/models/User';
import ILoginService from '../interfaces/ILoginService';

export default class LoginService implements ILoginService<IUser> {
  public login = async (login: ILogin): Promise<IUser> => {
    const user = await User.findOne({ where: { email: login.email } });

    if (!user) throw Error('s');

    return user;
  };
}
