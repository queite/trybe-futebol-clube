import IUser, { ILogin } from './IUser';

export default interface ILoginService {
  login(data: ILogin): Promise<IUser>
  validate(email: string): Promise<string>
}
