import { OrderTable } from '../../order/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'shipping_cost' })
export class ShippingCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  city: string;

  @Column('float')
  cost: number;

  @OneToMany(() => OrderTable, (order) => order.ShippingCost)
  orders: OrderTable[];
}
