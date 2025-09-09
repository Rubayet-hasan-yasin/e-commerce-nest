import { Customer } from '../../customer/entities/customer.entity';
import { OrderTable } from '../../order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  fullName: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  status?: number;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  floor?: string;

  @Column({ nullable: true })
  apartment?: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'phone', referencedColumnName: 'phone' })
  customer: Customer;

  @OneToMany(() => OrderTable, (orderTable) => orderTable.address)
  orderTables: OrderTable[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
