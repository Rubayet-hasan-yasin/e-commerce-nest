import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ShippingCostService } from './shipping-cost.service';
import { CreateShippingCostDto } from './dto/create-shipping-cost.dto';
import { UpdateShippingCostDto } from './dto/update-shipping-cost.dto';
import { UserRole } from 'src/modules/v1/user/entities/user.entity';
import { Roles } from 'src/modules/v1/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/v1/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/v1/auth/guards/roles.guard';
import { Public } from 'src/modules/v1/auth/decorators/public.decorator';

@Controller({ path: 'shipping-cost', version: '1' })
export class ShippingCostController {
  constructor(private readonly shippingCostService: ShippingCostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createShippingCostDto: CreateShippingCostDto) {
    return this.shippingCostService.create(createShippingCostDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.shippingCostService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateShippingCostDto: UpdateShippingCostDto,
  ) {
    return this.shippingCostService.update(+id, updateShippingCostDto);
  }
}
