import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Public } from 'src/modules/v1/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { GetAuthUser } from 'src/modules/v1/auth/decorators/get-user.decorator';
import { UserInfo } from 'src/interface/user-info.type';

@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Public()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.orderService.findAll();
  }

  @Get('customer')
  findAllOrderByCutomer(@GetAuthUser() authUser: UserInfo) {
    return this.orderService.OrderByCutomer(authUser.id);
  }

  @Patch('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(dto);
  }
}
