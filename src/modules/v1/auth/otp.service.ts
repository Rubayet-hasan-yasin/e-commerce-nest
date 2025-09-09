import { InjectRepository } from '@nestjs/typeorm';
import { SendOtpDto } from './dto/send-otp.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthOtp } from './entities/auth.otp.entity';
import { Repository } from 'typeorm';
import { Env } from 'src/config/env';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(AuthOtp)
    private readonly authOtpRepository: Repository<AuthOtp>,
  ) {}
  async sendOtp(dto: SendOtpDto) {
    const otp = this.generateOtp();
    const minutes = Number(Env.AUTH_OTP_EXPIRED);

    if (isNaN(minutes)) {
      throw new Error('Invalid AUTH_OTP_EXPIRED env value');
    }
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    let otpRecord = await this.authOtpRepository.findOne({
      where: { phone: dto.phone },
    });

    if (!otpRecord) {
      otpRecord = this.authOtpRepository.create({
        phone: dto.phone,
        otp: Number(otp),
        expiresAt,
      });
    } else {
      otpRecord.otp = Number(otp);
      otpRecord.expiresAt = expiresAt;
    }

    await this.authOtpRepository.save(otpRecord);

    try {
      const smsResponse = await fetch(
        'http://234332.234234:3000/external/sms/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: dto.phone,
            smsContent: `Your OTP is ${otp}.`,
            createdBy: 'system',
          }),
        },
      );

      if (!smsResponse.ok) {
        throw new Error(`Failed to send SMS: ${smsResponse.statusText}`);
      }

      return {
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error('SMS send error:', error);
      throw new Error('OTP saved, but failed to send SMS');
    }
  }

  async verifyOtp(data: VerifyOtpDto) {
    const storedOtp = await this.authOtpRepository.findOneBy({
      phone: data.phone,
    });

    if (
      !storedOtp ||
      storedOtp.otp !== data.otp ||
      new Date() > storedOtp.expiresAt
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  findOtp(phone: string) {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;

    if (!bdPhoneRegex.test(phone)) {
      throw new BadRequestException('Invalid phone number');
    }

    return this.authOtpRepository.findOneBy({ phone });
  }

  generateOtp(length: number = 4): string {
    const otp = Math.floor(Math.random() * Math.pow(10, length)).toString();
    if (otp.length < length) {
      return this.generateOtp(length);
    }
    return otp;
  }
}
