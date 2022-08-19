import { Request, Response } from 'express';
import UnauthorizedError from '../errors/unauthorizedError';
import jwtService from '../services/jwtService';
import BadRequestError from '../errors/badRequestError';
import LoginService from '../services/loginService';

export default class LoginController {
  // constructor(private loginService: LoginService) {}

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError('All fields must be filled');
    const user = await LoginService.login(req.body);
    const token = jwtService.sign(user.email);
    return res.status(200).json({ token });
  };

  public validate = async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedError('Invalid token');

    const payload = jwtService.verify(token) as string;
    const role = await LoginService.validate(payload);
    return res.status(200).json({ role });
  };
}