import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderTable } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, OrderTable])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
