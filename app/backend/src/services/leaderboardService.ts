import IBoard from '../interfaces/Iboard';
import IMatch from '../interfaces/IMatch';
import MatchService from './matchService';
import TeamService from './teamService';

export default class LeaderboardService {
  public static totalPointsCalc(match: IMatch[]) {
    let totalPoints = 0;
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;
    match.forEach((element) => {
      if (element.homeTeamGoals > element.awayTeamGoals) {
        totalPoints += 3;
        totalVictories += 1;
      } else if (element.homeTeamGoals === element.awayTeamGoals) {
        totalPoints += 1;
        totalDraws += 1;
      } else if (element.homeTeamGoals < element.awayTeamGoals) {
        totalPoints += 0;
        totalLosses += 1;
      }
    });
    return { totalPoints, totalVictories, totalDraws, totalLosses };
  }

  public static efficiencyCalc(points: number, matches: number) {
    return Number(((points / (matches * 3)) * 100).toFixed(2));
  }

  public static goalsCalc(matches: IMatch[]) {
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      goalsFavor += match.homeTeamGoals;
      goalsOwn += match.awayTeamGoals;
    });

    return { goalsFavor, goalsOwn, goalsBalance: goalsFavor - goalsOwn };
  }

  public static async getResults() {
    const teams = await TeamService.getAll();
    const matches = await MatchService.getAll();

    const finishedMatches = matches.filter((match) => match.inProgress === false);
    const results = await Promise.all(teams.map((team) => {
      const teamMatches = finishedMatches
        .filter((match: IMatch) => team.teamName === match.teamHome?.teamName);
      return this.createResults(teamMatches);
    }));
    return this.orderBoard(results);
  }

  public static createResults(matches: IMatch[]) {
    return {
      name: matches[0].teamHome?.teamName,
      totalPoints: this.totalPointsCalc(matches).totalPoints,
      totalGames: matches.length,
      totalVictories: this.totalPointsCalc(matches).totalVictories,
      totalDraws: this.totalPointsCalc(matches).totalDraws,
      totalLosses: this.totalPointsCalc(matches).totalLosses,
      goalsFavor: this.goalsCalc(matches).goalsFavor,
      goalsOwn: this.goalsCalc(matches).goalsOwn,
      goalsBalance: this.goalsCalc(matches).goalsBalance,
      efficiency: this.efficiencyCalc(this.totalPointsCalc(matches).totalPoints, matches.length),
    };
  }

  public static orderBoard(results: IBoard[]) {
    return results.sort((a: IBoard, b: IBoard) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn);
  }
}
