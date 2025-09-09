import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderTable } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderTable, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderTable;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // @ManyToOne(() => Size, (size) => size.orderItems)
  // @JoinColumn({ name: 'sizeId' })
  size: number;

  @Column('float')
  weight: number;

  @Column('float')
  price: number;

  @Column()
  quantity: number;

  @Column('float')
  totalPrice: number;
}
