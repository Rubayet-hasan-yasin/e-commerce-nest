import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerService } from 'src/modules/v1/customer/customer.service';
import { BcryptHelper } from 'src/helpers/bcrypt.helper';
import { JwtHelper } from 'src/helpers/jwt.helper';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpService } from './otp.service';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';
import { Env } from 'src/config/env';

@Injectable()
export class CustomerAuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly otpService: OtpService,
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
    const customer = await this.customerService.findUserByPhone(phone);

    if (!customer || !customer.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.bcryptHelper.compareHash(
      password,
      customer.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: customer?.id,
      name: customer.fullName,
      phone: customer.phone,
      role: customer.role,
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
  async loginWihtOtp(
    loginDto: LoginWithOtpDto,
    res: Response,
  ): Promise<{
    id: number;
    name: string;
    phone: string;
    role: string;
    accessToken: string;
  }> {
    const { phone, otp } = loginDto;
    const storedOtp = await this.otpService.findOtp(phone);

    if (
      !storedOtp ||
      storedOtp.phone !== phone ||
      otp !== storedOtp.otp ||
      new Date() > storedOtp.expiresAt
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const customer = await this.customerService.findUserByPhone(phone);

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: customer?.id,
      name: customer.fullName,
      phone: customer.phone,
      role: customer.role,
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

  async resetPassword(dto: ResetPasswordDto) {
    const storedOtp = await this.otpService.findOtp(dto.phone);

    if (!storedOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (storedOtp.otp !== dto.otp) {
      throw new BadRequestException('Incorrect OTP');
    }

    if (new Date() > storedOtp.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await this.bcryptHelper.hashString(dto.password);

    const updatedCustomer = await this.customerService.updateCustomerPassword(
      dto.phone,
      hashedPassword,
    );

    if (!updatedCustomer) {
      throw new BadRequestException('Failed to update password');
    }

    return {
      success: true,
      message: 'Password has been reset successfully',
      customer: updatedCustomer.fullName,
    };
  }
}
