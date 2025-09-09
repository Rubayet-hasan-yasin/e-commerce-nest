import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { OrderItem } from '../../order/entities/order-item.entity';

@Entity('product_sizes')
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weight: string;

  @Column('float')
  price: number;

  @Column('float', { nullable: true })
  discountPrice?: number;

  @Column('float', { nullable: true })
  discountParsent?: number;

  @Column({ nullable: true, unique: true })
  barCode?: string;

  @ManyToOne(() => Product, (product) => product.sizes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @OneToMany(() => OrderItem, (item) => item.size)
  orderItems: OrderItem[];
}
