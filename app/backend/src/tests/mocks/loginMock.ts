import IUser from "../../interfaces/IUser";

export const userMock: IUser = {
  id: 1,
  username: 'test',
  role: 'any',
  email: 'test@test.com',
  password: '123456',
}

export const loginMock = {
  email: 'test@test.com',
  password: '123456',
}


export const loginBadPasswordMock = {
  email: 'test@test.com',
  password: '12345',
}

export const badLoginMock = {
  email: null,
  password: '123456',
}