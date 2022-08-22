export interface ISaveMatchBody {
  homeTeam: number
  awayTeam: number
  homeTeamGoals: number
  awayTeamGoals: number
}

export default interface IMatch extends ISaveMatchBody {
  id: number
  inProgress: boolean
  teamHome: {
    teamName: string
  }
  teamAway: {
    teamName: string
  }
}
