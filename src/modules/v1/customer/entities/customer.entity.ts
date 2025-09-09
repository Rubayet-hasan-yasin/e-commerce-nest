import { Address } from '../../address/entities/address.entity';
import { OrderTable } from '../../order/entities/order.entity';
import { Payment } from '../../order/entities/payment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column()
  fullName: string;

  @Column({ default: 'customer' })
  role: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => OrderTable, (order) => order.Customer)
  orders: OrderTable[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];

  @OneToMany(() => Address, (address) => address.customer)
  addresses: Address[];
}
