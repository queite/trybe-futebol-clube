import ITeam from '../interfaces/ITeam';
import IBoard from '../interfaces/Iboard';
import IMatch from '../interfaces/IMatch';
import IMatchRepository from '../interfaces/IMatchRepository';
import ITeamRepository from '../interfaces/ITeamRepository';

export default class LeaderboardService {
  constructor(private matchRepo: IMatchRepository, private teamRepo: ITeamRepository) {}

  public static totalPointsCalc(from: 'home' | 'away', match: IMatch[]) {
    const rival = from === 'home' ? 'away' : 'home';
    let totalPoints = 0;
    match.forEach((element) => {
      if (element[`${from}TeamGoals`] > element[`${rival}TeamGoals`]) {
        totalPoints += 3;
      } else if (element[`${from}TeamGoals`] === element[`${rival}TeamGoals`]) {
        totalPoints += 1;
      } else if (element[`${from}TeamGoals`] < element[`${rival}TeamGoals`]) {
        totalPoints += 0;
      }
    });
    return totalPoints;
  }

  public static matchesCalc(from: 'home' | 'away', match: IMatch[]) {
    const rival = from === 'home' ? 'away' : 'home';
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;
    match.forEach((element) => {
      if (element[`${from}TeamGoals`] > element[`${rival}TeamGoals`]) {
        totalVictories += 1;
      } else if (element[`${from}TeamGoals`] === element[`${rival}TeamGoals`]) {
        totalDraws += 1;
      } else if (element[`${from}TeamGoals`] < element[`${rival}TeamGoals`]) {
        totalLosses += 1;
      }
    });
    return { totalVictories, totalDraws, totalLosses };
  }

  public static efficiencyCalc(points: number, matches: number) {
    return Number(((points / (matches * 3)) * 100).toFixed(2));
  }

  public static goalsCalc(from: 'home' | 'away', matches: IMatch[]) {
    const rival = from === 'home' ? 'away' : 'home';
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      goalsFavor += match[`${from}TeamGoals`];
      goalsOwn += match[`${rival}TeamGoals`];
    });

    return { goalsFavor, goalsOwn, goalsBalance: goalsFavor - goalsOwn };
  }

  async getResults(from: 'home' | 'away') {
    const teamFrom = from === 'home' ? 'Home' : 'Away';
    const teams = await this.teamRepo.findAll();
    const matches = await this.matchRepo.findAll();
    const finishedMatches = matches.filter((match: IMatch) => match.inProgress === false);

    const results = await Promise.all(teams.map((team) => {
      const teamMatches = finishedMatches
        .filter((match: IMatch) => team.teamName === match[`team${teamFrom}`]?.teamName);
      return LeaderboardService.createResults(from, teamMatches);
    }));
    return LeaderboardService.orderBoard(results);
  }

  public static createResults(from: 'home' | 'away', matches: IMatch[]) {
    const teamFrom = from === 'home' ? 'Home' : 'Away';
    return {
      name: matches[0][`team${teamFrom}`]?.teamName,
      totalPoints: this.totalPointsCalc(from, matches),
      totalGames: matches.length,
      totalVictories: this.matchesCalc(from, matches).totalVictories,
      totalDraws: this.matchesCalc(from, matches).totalDraws,
      totalLosses: this.matchesCalc(from, matches).totalLosses,
      goalsFavor: this.goalsCalc(from, matches).goalsFavor,
      goalsOwn: this.goalsCalc(from, matches).goalsOwn,
      goalsBalance: this.goalsCalc(from, matches).goalsBalance,
      efficiency: this.efficiencyCalc(this.totalPointsCalc(from, matches), matches.length),
    };
  }

  public static orderBoard(results: IBoard[]) {
    return results.sort((a: IBoard, b: IBoard) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn);
  }

  // Métodos para geração de resultado consolidado
  public static filterTeams(team: ITeam, homeTeams: IBoard[]) {
    const [obj] = homeTeams.filter((item) => item.name === team.teamName);
    return obj;
  }

  // eslint-disable-next-line class-methods-use-this
  createTotalResults(teams:ITeam[], homeTeams: IBoard[], awayTeams: IBoard[]) {
    return teams.map((team) => ({
      name: team.teamName,
      totalPoints: LeaderboardService.filterTeams(team, homeTeams).totalPoints
        + LeaderboardService.filterTeams(team, awayTeams).totalPoints,
      totalGames: LeaderboardService.filterTeams(team, homeTeams).totalGames
        + LeaderboardService.filterTeams(team, awayTeams).totalGames,
      totalVictories: LeaderboardService.filterTeams(team, homeTeams).totalVictories
        + LeaderboardService.filterTeams(team, awayTeams).totalVictories,
      totalDraws: LeaderboardService.filterTeams(team, homeTeams).totalDraws
        + LeaderboardService.filterTeams(team, awayTeams).totalDraws,
      totalLosses: LeaderboardService.filterTeams(team, homeTeams).totalLosses
        + LeaderboardService.filterTeams(team, awayTeams).totalLosses,
      goalsFavor: LeaderboardService.filterTeams(team, homeTeams).goalsFavor
        + LeaderboardService.filterTeams(team, awayTeams).goalsFavor,
      goalsOwn: LeaderboardService.filterTeams(team, homeTeams).goalsOwn
        + LeaderboardService.filterTeams(team, awayTeams).goalsOwn,
      goalsBalance: LeaderboardService.filterTeams(team, homeTeams).goalsBalance
      + LeaderboardService.filterTeams(team, awayTeams).goalsBalance }));
  }

  async getTotalResults() {
    const teams = await this.teamRepo.findAll();
    const homeTeams = await this.getResults('home');
    const awayTeams = await this.getResults('away');

    const board = this.createTotalResults(teams, homeTeams, awayTeams);
    const finishedBoard = board.map((item) => ({
      ...item,
      efficiency: LeaderboardService.efficiencyCalc(item.totalPoints, item.totalGames),
    }));
    return LeaderboardService.orderBoard(finishedBoard);
  }
}
