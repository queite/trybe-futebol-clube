import ITeam from './ITeam';

export default interface ITeamRepository {
  findAll(): Promise<ITeam[]>
  findById(id: number): Promise<ITeam | null>
}
