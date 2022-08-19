import { sign, verify } from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET || 'string';

export default class jwtService {
  static sign(payload: string): string { // payload recebe apenas e-mail
    return sign(payload, secret);
  }

  static verify(token: string) {
    return verify(token, secret);
  }
}
