import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Address } from '../../address/entities/address.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { ShippingCost } from '../../shipping-cost/entities/shipping-cost.entity';
import { Payment } from './payment.entity';

@Entity()
export class OrderTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column({ nullable: true })
  createForm?: string;

  @Column()
  shippingCostId: number;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column({ nullable: true })
  paymentId?: number;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  packetSize?: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  orderItems: OrderItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  addressId?: number;

  @Column({ default: 1 })
  status: number;

  @ManyToOne(() => Address, (address) => address.orderTables, {
    nullable: true,
  })
  @JoinColumn({ name: 'addressId' })
  Address?: Address;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerId' })
  Customer: Customer;

  @ManyToOne(() => ShippingCost, (shippingCost) => shippingCost.orders)
  @JoinColumn({ name: 'shippingCostId' })
  ShippingCost: ShippingCost;

  @ManyToOne(() => Payment, (payment) => payment.orders, { nullable: true })
  @JoinColumn({ name: 'paymentId' })
  Payment?: Payment;
}
