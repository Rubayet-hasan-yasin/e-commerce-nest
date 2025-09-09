import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from './modules/v1/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/v1/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ProductModule } from './modules/v1/product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { ShippingCostModule } from './modules/v1/shipping-cost/shipping-cost.module';
import { BannerModule } from './modules/v1/banner/banner.module';
import { AddressModule } from './modules/v1/address/address.module';
import { ContactModule } from './modules/v1/contact/contact.module';
import { AboutModule } from './modules/v1/about/about.module';
import { CustomerModule } from './modules/v1/customer/customer.module';
import { OrderModule } from './modules/v1/order/order.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DashboardModule } from './modules/v1/dashboard/dashboard.module';
import { CartModule } from './modules/v1/cart/cart.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    // TypeOrmModule.forRoot(databaseConfig2),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/image',
    }),
    UserModule,
    ProductModule,
    FileUploadModule,
    ShippingCostModule,
    BannerModule,
    AddressModule,
    ContactModule,
    AboutModule,
    CustomerModule,
    OrderModule,
    DashboardModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // apply to all routes
  }
}
