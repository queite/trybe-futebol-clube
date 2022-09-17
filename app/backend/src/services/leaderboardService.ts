import ITeam from '../interfaces/ITeam';
import IBoard from '../interfaces/Iboard';
import IMatch from '../interfaces/IMatch';
import IMatchRepository from '../interfaces/IMatchRepository';
import ITeamRepository from '../interfaces/ITeamRepository';

export default class LeaderboardService {
  constructor(private matchRepo: IMatchRepository, private teamRepo: ITeamRepository) {}

  totalPointsCalc = (from: 'home' | 'away', match: IMatch[]) => {
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
  };

  matchesCalc = (from: 'home' | 'away', match: IMatch[]) => {
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
  };

  efficiencyCalc = (points: number, matches: number) => Number(((points / (matches * 3)) * 100)
    .toFixed(2));

  goalsCalc = (from: 'home' | 'away', matches: IMatch[]) => {
    const rival = from === 'home' ? 'away' : 'home';
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      goalsFavor += match[`${from}TeamGoals`];
      goalsOwn += match[`${rival}TeamGoals`];
    });

    return { goalsFavor, goalsOwn, goalsBalance: goalsFavor - goalsOwn };
  };

  createResults(from: 'home' | 'away', matches: IMatch[]) {
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

  orderBoard = (results: IBoard[]) => results
    .sort((a: IBoard, b: IBoard) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || a.goalsOwn - b.goalsOwn);

  async getResults(from: 'home' | 'away') {
    const teamFrom = from === 'home' ? 'Home' : 'Away';
    const teams = await this.teamRepo.findAll();
    const matches = await this.matchRepo.findAll();
    const finishedMatches = matches.filter((match: IMatch) => match.inProgress === false);

    // Pega todos os times e para cada um faz um filtro nas partidas terminadas em que o nome do time é o mesmo do nome do time da partida de (casa ou de fora cfe o caso) e retorna o obj calculado de cada time.
    const results = await Promise.all(teams.map((team) => {
      const teamMatches = finishedMatches
        .filter((match: IMatch) => team.teamName === match[`team${teamFrom}`]?.teamName);
      return this.createResults(from, teamMatches);
    }));
    return this.orderBoard(results);
  }

  // Métodos para geração de resultado consolidado

  //
  filterTeams = (team: ITeam, homeTeams: IBoard[]) => {
    const [obj] = homeTeams.filter((item) => item.name === team.teamName);
    return obj;
  };

  createTotalResults(teams:ITeam[], homeTeams: IBoard[], awayTeams: IBoard[]) {
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

  async getTotalResults() {
    const teams = await this.teamRepo.findAll();
    const homeTeams = await this.getResults('home');
    const awayTeams = await this.getResults('away');

    const board = this.createTotalResults(teams, homeTeams, awayTeams);

    const finishedBoard = board.map((item) => ({
      ...item,
      efficiency: this.efficiencyCalc(item.totalPoints, item.totalGames),
    }));
    return this.orderBoard(finishedBoard);
  }
}
