import { Module } from '@nestjs/common';
import { BcryptHelper } from './bcrypt.helper';
import { JwtHelper } from './jwt.helper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env';

const HELPERS = [JwtHelper, BcryptHelper];

@Module({
  imports: [
    HelperModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: Env.JWT_SECRET,
        signOptions: { expiresIn: Env.JWT_EXPIRED },
      }),
    }),
  ],
  providers: [...HELPERS],
  exports: [...HELPERS, JwtModule],
})
export class HelperModule {}
