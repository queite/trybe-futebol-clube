import ITeam from '../interfaces/ITeam';
import IBoard from '../interfaces/Iboard';
import IMatch from '../interfaces/IMatch';
import MatchService from './matchService';
import TeamService from './teamService';

export default class LeaderboardService {
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

  public static async getResults(from: 'home' | 'away') {
    const teamFrom = from === 'home' ? 'Home' : 'Away';
    const teams = await TeamService.getAll();
    const matches = await MatchService.getAll();
    const finishedMatches = matches.filter((match) => match.inProgress === false);

    const results = await Promise.all(teams.map((team) => {
      const teamMatches = finishedMatches
        .filter((match: IMatch) => team.teamName === match[`team${teamFrom}`]?.teamName);
      return this.createResults(from, teamMatches);
    }));
    return this.orderBoard(results);
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

  public static filterTeams(team: ITeam, homeTeams: IBoard[]) {
    const [obj] = homeTeams.filter((item) => item.name === team.teamName);
    return obj;
  }

  public static createTotalResults(teams:ITeam[], homeTeams: IBoard[], awayTeams: IBoard[]) {
    return teams.map((team) => ({
      name: team.teamName,
      totalPoints: this.filterTeams(team, homeTeams).totalPoints
        + this.filterTeams(team, awayTeams).totalPoints,
      totalGames: this.filterTeams(team, homeTeams).totalGames
        + this.filterTeams(team, awayTeams).totalGames,
      totalVictories: this.filterTeams(team, homeTeams).totalVictories
        + this.filterTeams(team, awayTeams).totalVictories,
      totalDraws: this.filterTeams(team, homeTeams).totalDraws
        + this.filterTeams(team, awayTeams).totalDraws,
      totalLosses: this.filterTeams(team, homeTeams).totalLosses
        + this.filterTeams(team, awayTeams).totalLosses,
      goalsFavor: this.filterTeams(team, homeTeams).goalsFavor
        + this.filterTeams(team, awayTeams).goalsFavor,
      goalsOwn: this.filterTeams(team, homeTeams).goalsOwn
        + this.filterTeams(team, awayTeams).goalsOwn,
      goalsBalance: this.filterTeams(team, homeTeams).goalsBalance
      + this.filterTeams(team, awayTeams).goalsBalance }));
  }

  public static async getTotalResults() {
    const teams = await TeamService.getAll();
    const homeTeams = await LeaderboardService.getResults('home');
    const awayTeams = await LeaderboardService.getResults('away');

    const board = this.createTotalResults(teams, homeTeams, awayTeams);
    const finishedBoard = board.map((item) => ({
      ...item,
      efficiency: this.efficiencyCalc(item.totalPoints, item.totalGames),
    }));
    return this.orderBoard(finishedBoard);
  }
}
