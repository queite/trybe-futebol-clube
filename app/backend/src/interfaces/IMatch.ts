export interface IGoals {
  homeTeamGoals: number
  awayTeamGoals: number
}

export interface ISaveMatchBody extends IGoals {
  homeTeam: number
  awayTeam: number
}

export default interface IMatch extends ISaveMatchBody {
  id: number
  inProgress: boolean
  teamHome?: {
    teamName: string
  }
  teamAway?: {
    teamName: string
  }
}
