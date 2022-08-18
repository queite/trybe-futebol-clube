import { NextFunction, Request, Response } from 'express';
import httpException from '../errors/httpException';

const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = err as httpException;
  res.status(status || 500).json({ message });
};

export default errorMiddleware;
