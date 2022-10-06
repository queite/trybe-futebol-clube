import IUser from './IUser';

export default interface IUserRepository {
  findOne(email: string): Promise<IUser | null>
}
