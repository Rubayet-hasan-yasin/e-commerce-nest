import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/modules/v1/user/entities/user.entity';
import { HelperModule } from 'src/helpers/helper.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { AuthOtp } from './entities/auth.otp.entity';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';
import { CustomerModule } from 'src/modules/v1/customer/customer.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: Env.JWT_SECRET,
        signOptions: { expiresIn: Env.JWT_EXPIRED },
      }),
    }),
    TypeOrmModule.forFeature([User, AuthOtp]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    HelperModule,
    CustomerModule,
    CustomerModule,
  ],
  controllers: [AuthController, OtpController, CustomerAuthController],
  providers: [AuthService, JwtStrategy, OtpService, CustomerAuthService],
})
export class AuthModule {}
