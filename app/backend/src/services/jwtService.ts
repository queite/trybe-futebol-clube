import { sign } from 'jsonwebtoken';

export default class jwtService {
  static sign(payload: string): string {
    return sign(payload, 'secret');
  }
}
