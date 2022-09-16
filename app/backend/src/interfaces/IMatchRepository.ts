import IMatch, { ISaveMatchBody } from './IMatch';

export default interface IMatchRepository {
  findAll(): Promise<IMatch[]>
  create(match: ISaveMatchBody): Promise<IMatch>
  update(id: number, update: object): Promise<number>
}
