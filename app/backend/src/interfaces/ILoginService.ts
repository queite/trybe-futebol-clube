import { ILogin } from './IUser';

export default interface ILoginService<T> {
  login(data: ILogin): Promise<T>
}
