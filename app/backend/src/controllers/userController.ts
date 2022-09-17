import { Request, Response } from 'express';
import jwtService from '../services/jwtService';
import HttpException from '../errors/httpException';
import UserService from '../services/userService';

export default class UserController {
  constructor(private userService: UserService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) throw new HttpException(400, 'All fields must be filled');

    const user = await this.userService.login(req.body);
    const token = jwtService.sign(user.email);
    return res.status(200).json({ token });
  }

  async validate(req: Request, res: Response) {
    const token = req.headers.authorization;
    if (!token) throw new HttpException(401, 'Invalid token');

    const payload = jwtService.verify(token) as string;
    const role = await this.userService.validate(payload);
    return res.status(200).json({ role });
  }
}
