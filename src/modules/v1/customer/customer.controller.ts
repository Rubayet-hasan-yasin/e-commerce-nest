import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { Public } from 'src/modules/v1/auth/decorators/public.decorator';

@Controller({ path: 'customer', version: '1' })
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Public()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  allCustomerDetails() {
    return this.customerService.allCustomerDetails();
  }

  @Get()
  @Public()
  findUserData(@Query('phone') phone: string) {
    return this.customerService.findUserData(phone);
  }
}
