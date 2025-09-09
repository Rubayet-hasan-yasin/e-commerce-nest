import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { OrderTable } from 'src/modules/v1/order/entities/order.entity';
import { Customer } from 'src/modules/v1/customer/entities/customer.entity';
import { Product } from 'src/modules/v1/product/entities/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(OrderTable)
    private readonly orderRepo: Repository<OrderTable>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getDashboardData() {
    const [totalOrders, totalUsers, totalProducts] = await Promise.all([
      this.orderRepo.count(),
      this.customerRepo.count(),
      this.productRepo.count(),
    ]);

    const totalSales = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .getRawOne<{ total: string }>();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailySales = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.createdAt >= :today', { today })
      .getRawOne<{ total: string }>();

    const dailyOrders = await this.orderRepo.count({
      where: {
        createdAt: MoreThanOrEqual(today),
      },
    });

    return [
      {
        title: 'Total Orders',
        value: totalOrders.toString(),
      },
      {
        title: 'Total Users',
        value: totalUsers.toString(),
      },
      {
        title: 'Total Sales',
        value: totalSales?.total
          ? parseFloat(totalSales.total).toFixed(2)
          : '0.00',
      },
      {
        title: 'Total Products',
        value: totalProducts.toString(),
      },
      {
        title: 'Daily Orders',
        value: dailyOrders.toString(),
      },
      {
        title: 'Daily Sales',
        value: dailySales?.total
          ? parseFloat(dailySales.total).toFixed(2)
          : '0.00',
      },
    ];
  }
}
