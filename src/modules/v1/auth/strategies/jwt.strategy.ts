import { UserService } from './../../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/config/env';
import { CustomerService } from 'src/modules/v1/customer/customer.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly CustomerService: CustomerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.cookies?.access_token) {
            return req.cookies.access_token as string;
          }

          const authHeader = req.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: Env.JWT_SECRET,
    });
  }

  async validate(payload: { phone: string; role: string }) {
    if (payload.role === 'customer') {
      const customer = await this.CustomerService.findUserByPhone(
        payload.phone,
      );

      if (!customer) {
        throw new UnauthorizedException('Invalid token');
      }

      const newUserData = {
        id: customer.id,
        fullName: customer.fullName,
        phone: customer.phone,
        role: customer.role,
      };

      return newUserData;
    } else {
      const user = await this.userService.getUserByPhone(payload.phone);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const newUserData = {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      };

      return newUserData;
    }
  }
}
