import IUser, { ILogin } from './IUser';

export default interface ILoginService {
  login(login: ILogin): Promise<IUser>
  validate(email: string): Promise<string>
}
