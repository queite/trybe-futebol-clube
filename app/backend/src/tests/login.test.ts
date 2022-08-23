import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';
import jwtService from '../services/jwtService';
import * as bcrypt from 'bcryptjs';
import LoginService from '../services/loginService';
import { badLoginMock, loginBadPasswordMock, loginMock, userMock } from './mocks/loginMock';


chai.use(chaiHttp);

const { expect } = chai;

describe('/login', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('should return a token in case of success', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const response = await chai.request(app).post('/login').send(loginMock);
    expect(response.body).to.have.key('token');
  })

  it('should return an error if email is not registered', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    const response = await chai.request(app).post('/login').send(loginMock);
    expect(response.body).to.be.deep.eq({ message: 'Incorrect email or password' });
  })

  it('should return an error if password is not correct', async () => {
    sinon.stub(LoginService, 'getByEmail').resolves(userMock)
    sinon.stub(bcrypt, 'compareSync').returns(false);

    const response = await chai.request(app).post('/login').send(loginBadPasswordMock);
    expect(response.body).to.be.deep.eq({ message: 'Incorrect email or password' });
  })

  it('should return an error if email is not send', async () => {
    const response = await chai.request(app).post('/login').send(badLoginMock);
    expect(response.body).to.be.deep.eq({ message: 'All fields must be filled' });
  })
})

describe('/login/validate', () => {
  afterEach(() => {
    sinon.restore();
  })

  it('should return a role if a valid token is send', async () => {
    sinon.stub(jwtService,  'verify').returns('test@test.com')
    sinon.stub(LoginService, 'getByEmail').resolves(userMock);

    const response = await chai.request(app).get('/login/validate').set({ "Authorization": `token` });

    expect(response.body).to.be.deep.eq({role: 'any'});
  })

  it('should return status 401 and message "Invalid token" if token is not send', async () => {
    const response = await chai.request(app).get('/login/validate')
    expect(response.status).to.be.eq(401);
    expect(response.body).to.be.deep.eq({message: 'Invalid token'});
  })

  it('should return status 401 and meddage "Email not found" if the email is not registered', async () => {
    sinon.stub(jwtService,  'verify').returns('test@test.com')
    sinon.stub(LoginService, 'getByEmail').resolves(null)

    const res = await chai.request(app).get('/login/validate').set({ "Authorization": `token` });
    expect(res.status).to.be.eq(404);
    expect(res.body).to.be.deep.eq({message: 'Email not found'});
  })
})