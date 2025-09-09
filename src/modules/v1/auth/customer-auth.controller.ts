import { Body, Controller, Post, Res } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';

@Controller({ path: 'auth/customer', version: '1' })
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}
  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.customerAuthService.login(loginDto, res);

    res.status(200).json(result);
  }

  @Post('/login/otp')
  @Public()
  async loginWihtOtp(@Body() loginDto: LoginWithOtpDto, @Res() res: Response) {
    const result = await this.customerAuthService.loginWihtOtp(loginDto, res);

    res.status(200).json(result);
  }

  @Post('reset-password')
  @Public()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.customerAuthService.resetPassword(dto);
  }
}
