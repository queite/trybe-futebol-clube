import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import LeaderboardService from '../services/leaderboardService';
import { allMatchesMock, allTeamsMock, leaderboardAwayMock, leaderboardHomeMock, leaderboardMock } from './mocks/leaderboardMocks';
import SequelizeTeamRepository from '../repositories/SequelizeTeamRepository';
import SequelizeMatchRepository from '../repositories/SequelizeMatchRepository';
import IMatch from '../interfaces/IMatch';

chai.use(chaiHttp);

const { expect } = chai;

const teamRepo = new SequelizeTeamRepository();
const matchRepo = new SequelizeMatchRepository();

beforeEach(() => {
  sinon.stub(teamRepo, 'findAll').resolves(allTeamsMock);
})

afterEach(() => {
  sinon.restore();
})

describe('/leaderboard/home', () => {
  it('should return status 200 and an array', async () => {
    sinon.stub(matchRepo, 'findAll').resolves(allMatchesMock as IMatch[])

    const res = await chai.request(app).get('/leaderboard/home')
    expect(res.status).to.be.eq(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.all.keys('name', 'totalPoints', 'totalGames',  'totalVictories', 'totalDraws', 'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance', 'efficiency');
  })
})

describe('/leaderboard/away', () => {
  it('should return status 200 and an array', async () => {
    sinon.stub(matchRepo, 'findAll').resolves(allMatchesMock as IMatch[])

    const res = await chai.request(app).get('/leaderboard/away')
    expect(res.status).to.be.eq(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.all.keys('name', 'totalPoints', 'totalGames',  'totalVictories', 'totalDraws', 'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance', 'efficiency');
  })
})

  describe('/leaderboard', () => {
    it('should return status 200 and an array', async () => {
      sinon.stub(LeaderboardService.prototype, 'getResults')
        .onFirstCall().resolves(leaderboardHomeMock)
        .onSecondCall().resolves(leaderboardAwayMock);

      const res = await chai.request(app).get('/leaderboard')
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.deep.eq(leaderboardMock);
    })
})