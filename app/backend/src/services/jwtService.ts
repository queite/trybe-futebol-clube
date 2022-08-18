import { sign } from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET || 'string';

export default class jwtService {
  static sign(payload: string): string {
    return sign(payload, secret);
  }
}
