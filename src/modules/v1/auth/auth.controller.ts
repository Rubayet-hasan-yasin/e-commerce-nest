import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto, res);

    // Send the response explicitly
    // console.log('Extracting token from cookies', req.cookies.access_token);
    res.status(200).json(result);
  }

  @Post('/logout')
  @Public()
  logout(@Res() res: Response) {
    // Clear the access token cookie
    res.clearCookie('access_token');

    // Send a response indicating successful logout
    res.status(200).json({ message: 'Logged out successfully' });
  }

  @Post('/register')
  // @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);

    return { message: 'Registration successful' };
  }
}
