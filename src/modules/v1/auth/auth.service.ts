import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UserService } from 'src/modules/v1/user/user.service';
import { BcryptHelper } from 'src/helpers/bcrypt.helper';
import { JwtHelper } from 'src/helpers/jwt.helper';
import { RegisterDto } from './dto/register.dto';
import { Env } from 'src/config/env';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptHelper: BcryptHelper,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{
    id: number;
    name: string;
    phone: string;
    role: string;
    accessToken: string;
  }> {
    const { phone, password } = loginDto;
    const user = await this.userService.getUserByPhone(phone);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.bcryptHelper.compareHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user?.id,
      name: user.fullName,
      phone: user.phone,
      role: user.role,
    };

    console.log('User logged in successfully:', payload);

    const accessToken = this.jwtHelper.generateToken(payload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === 'production',
      sameSite: Env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    const result = {
      ...payload,
      accessToken,
    };

    return result;
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { fullName, phone, password, role } = registerDto;
    const existingUser = await this.userService.getUserByPhone(phone);
    if (existingUser) {
      throw new BadRequestException(
        'User already exists with this phone number',
      );
    }
    const hashedPassword = await this.bcryptHelper.hashString(password);
    const newUser = await this.userService.createUser({
      fullName,
      phone,
      password: hashedPassword,
      role: role,
    });
    if (!newUser) {
      throw new InternalServerErrorException('Registration failed');
    }
    console.log('User registered successfully:', newUser);

    return { message: 'Registration successful' };
  }
}
