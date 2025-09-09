import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  public generateToken(payload: Record<string, unknown>): string {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid payload for JWT');
      }
      return this.jwtService.sign(payload);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error generating JWT:', error.message);
      } else {
        console.error('Error generating JWT:', error);
      }
      throw new Error('Error generating JWT');
    }
  }
}
