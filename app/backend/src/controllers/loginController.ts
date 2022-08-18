import { Request, Response } from 'express';
import jwtService from '../services/jwtService';
import ILoginService from '../interfaces/ILoginService';
import IUser from '../interfaces/IUser';
import BadRequestError from '../errors/badRequestError';

export default class LoginController {
  constructor(private userService: ILoginService<IUser>) {}

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError('All fields must be filled');
    const user = await this.userService.login(req.body);
    const token = jwtService.sign(user.email);
    return res.status(200).json({ token });
  };
}
