import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Env } from './env';
import { User } from 'src/modules/v1/user/entities/user.entity';
import { Product } from 'src/modules/v1/product/entities/product.entity';
import { Size } from 'src/modules/v1/product/entities/size.entity';
import { ShippingCost } from 'src/modules/v1/shipping-cost/entities/shipping-cost.entity';
import { Banner } from 'src/modules/v1/banner/entities/banner.entity';
import { OrderItem } from 'src/modules/v1/order/entities/order-item.entity';
import { OrderTable } from 'src/modules/v1/order/entities/order.entity';
import { Payment } from 'src/modules/v1/order/entities/payment.entity';
import { Address } from 'src/modules/v1/address/entities/address.entity';
import { Contact } from 'src/modules/v1/contact/entities/contact.entity';
import { About } from 'src/modules/v1/about/entities/about.entity';
import { AuthOtp } from 'src/modules/v1/auth/entities/auth.otp.entity';
import { Customer } from 'src/modules/v1/customer/entities/customer.entity';
import { ProductCategory } from 'src/modules/v1/product/entities/ProductCategory.entity';
import { Cart } from 'src/modules/v1/cart/entities/cart.entity';

export const entities = [
  User,
  Product,
  Size,
  ShippingCost,
  Banner,
  OrderItem,
  OrderTable,
  Payment,
  Address,
  Contact,
  About,
  AuthOtp,
  Customer,
  ProductCategory,
  Cart,
];

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: Env.DATABASE_HOST,
  port: Env.DATABASE_PORT,
  username: Env.DATABASE_USERNAME,
  password: Env.DATABASE_PASSWORD,
  database: Env.DATABASE_NAME,
  autoLoadEntities: true,
  entities: [...entities],
  synchronize: true,
  ssl: {
    rejectUnauthorized: true,
    ca: Env.DATABASE_SSL_CA,
  },
};
// export const databaseConfig2: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'password1234',
//   database: 'e-commerce',
//   autoLoadEntities: true,
//   entities: [...entities],
//   synchronize: true,
// };
