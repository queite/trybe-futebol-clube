import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match';
import { equalTeamBodyMock, matchMock, newMatchBodyMock, saveOnSuccessBody } from './mocks/matchMocks';
import jwtService from '../services/jwtService';
import Team from '../database/models/Team';
// import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/matches', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('should return status 200 and an array of matches at the route get /matches', async () => {
    sinon.stub(Match, "findAll").resolves([matchMock as unknown as Match])

    const response = await chai.request(app).get('/matches');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.be.deep.equal([matchMock]);
  })

  it('should return status 401 and an error if the teams are equal', async () => {
    sinon.stub(jwtService,  'verify').returns('test@test.com')

    const response = await chai.request(app).post('/matches').set({ "Authorization": `token` }).send(equalTeamBodyMock);
    expect(response.status).to.equal(401);
    expect(response.body).to.be.deep.equal({message: 'It is not possible to create a match with two equal teams'});
  })

  it('should return an object with the keys "id", "homeTeam", "homeTeamGoals", "awayTeam", "awayTeamGoals", "inProgress" in case of success at the route post /matches', async () => {
    sinon.stub(Match, 'create').resolves(saveOnSuccessBody as Match)
    sinon.stub(jwtService,  'verify').returns('test@test.com')

    const response = await chai.request(app).post('/matches').set({ "Authorization": `token` }).send(newMatchBodyMock);
    expect(response.body).to.have.all.keys('id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress');
  })

  //mockar findByPK
  it('should return status 404 and message "There is no team with such id!" in case one team ID is nor found', async () => {
    sinon.stub(Match, 'create').resolves(saveOnSuccessBody as Match)
    sinon.stub(jwtService,  'verify').returns('test@test.com')
    sinon.stub(Team, 'findByPk').resolves(null);

    const response = await chai.request(app).post('/matches').set({ "Authorization": `token` }).send(newMatchBodyMock);
    expect(response.status).to.be.eq(404);
    expect(response.body.message).to.be.eq('There is no team with such id!');
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

  it('should return the message "Match already finished or nonexistent ID" case the match is already finished or the ID is nonexistent', async () => {
    sinon.stub(Match, 'update').resolves([0, []]);

    const response = await chai.request(app).patch('/matches/1/finish');
    console.log(response.body, response.status)
    expect(response.body).to.be.deep.eq({message: 'Match already finished or nonexistent ID'});
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

  it('should return the message "Something went wrong" in case of failure', async () => {
    sinon.stub(Match, 'update').resolves([0, []]);

    const response = await chai.request(app).patch('/matches/1');
    expect(response.body).to.be.deep.eq({message: 'Something went wrong'});
  })
})