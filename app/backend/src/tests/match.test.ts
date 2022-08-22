import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match';
import { equalTeamBodyMock, matchMock, newMatchBodyMock, saveOnSuccessBody } from './mocks/matchMocks';
import jwtService from '../services/jwtService';
// import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/matches', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('should return status 200 and an array of matches', async () => {
    sinon.stub(Match, "findAll").resolves([matchMock as unknown as Match])

    const response = await chai.request(app).get('/matches');
    expect(response.status).to.equal(200)
    expect(response.body).to.be.an('array');
    expect(response.body).to.be.deep.equal([matchMock]);
  })

  it('should return status 401 if the teams are equal', async () => {
    const response = await chai.request(app).post('/matches').set({ "Authorization": `token` }).send(equalTeamBodyMock);
    expect(response.status).to.equal(401)
  })

  it('should return an object if case of success', async () => {
    sinon.stub(Match, 'create').resolves(saveOnSuccessBody as Match)
    sinon.stub(jwtService,  'verify').returns('test@test.com')

    const response = await chai.request(app).post('/matches').set({ "Authorization": `token` }).send(newMatchBodyMock);
    console.log(response.body)
    expect(response.body).to.have.all.keys('id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress');
  })

})

describe('/:id/finish', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('should return the message "Finished" in case of succcess', async () => {
    sinon.stub(Match, 'update').resolves([1, []]);

    const response = await chai.request(app).patch('/matches/1/finish');
    expect(response.body).to.be.deep.eq({message: 'Finished'});
  })
})

describe('/:id', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('should return the message "Match updated" in case of succcess', async () => {
    sinon.stub(Match, 'update').resolves([1, []]);

    const response = await chai.request(app).patch('/matches/1');
    expect(response.body).to.be.deep.eq({message: 'Match updated'});
  })
})