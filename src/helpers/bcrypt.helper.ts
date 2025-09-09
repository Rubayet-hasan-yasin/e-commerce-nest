import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Env } from 'src/config/env';

@Injectable()
export class BcryptHelper {
  public async hashString(plainText: string): Promise<string> {
    try {
      return await bcrypt.hash(plainText, Env.SALT_ROUNDS);
    } catch (error) {
      throw new Error('Error hashing string');
    }
  }

  public async compareHash(
    plainText: string,
    hashString: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainText, hashString);
    } catch (error) {
      throw new Error('Error comparing hash');
    }
  }
}
