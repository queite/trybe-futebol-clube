import { Request, Response } from 'express';
import jwtService from '../services/jwtService';
import ILoginService from '../interfaces/ILoginService';
import IUser from '../interfaces/IUser';

export default class LoginController {
  constructor(private userService: ILoginService<IUser>) {}

  public login = async (req: Request, res: Response) => {
    const user = await this.userService.login(req.body);
    const token = jwtService.sign(user.email);
    res.status(200).json({ token });
  };
}
