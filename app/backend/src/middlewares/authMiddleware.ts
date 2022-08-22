import { NextFunction, Request, Response } from 'express';
import jwtService from '../services/jwtService';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const payload = jwtService.verify(authorization);
  if (!payload) return res.status(401).json({ message: 'Invalid token' });
  // req.user = payload;
  next();
};
