import { sign, verify } from 'jsonwebtoken';
import 'dotenv/config';
import HttpException from '../errors/httpException';

const secret = process.env.JWT_SECRET || 'string';

export default class jwtService {
  static sign(payload: string): string { // payload recebe apenas e-mail
    return sign(payload, secret);
  }

  static verify(token: string): string | void {
    const validation = verify(token, secret, (err, decode) => {
      if (err) throw new HttpException(401, 'Token must be a valid token');
      return decode;
    });
    return validation;
  }
}
