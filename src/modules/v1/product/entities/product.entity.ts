import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Size } from './size.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { ProductCategory } from './ProductCategory.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  image: string[];

  @Column({ type: 'json', nullable: true })
  watermarkedImage?: string[];

  @Column()
  name: string;

  @Column({ nullable: true })
  localName?: string;

  @Column({ nullable: true, unique: true })
  productCode?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  keyword?: string;

  @Column({ nullable: true })
  sort?: string;

  @Column({ nullable: true })
  youtubeLink?: string;

  @OneToMany(() => Size, (size) => size.product)
  sizes: Size[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    eager: true,
  })
  category: ProductCategory;
}
