import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTable } from 'src/modules/v1/order/entities/order.entity';
import { Customer } from 'src/modules/v1/customer/entities/customer.entity';
import { Product } from 'src/modules/v1/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTable, Customer, Product])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
