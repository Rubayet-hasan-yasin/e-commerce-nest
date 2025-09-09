import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column()
  productLocalName: string;

  @Column({ type: 'json' })
  productImage: string[];

  @Column()
  sizeId: number;

  @Column()
  selectedSize: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'decimal', nullable: true })
  discountPrice: number;

  @Column()
  quantity: number;

  @Column('decimal')
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date;

  @BeforeInsert()
  setExpirationDate() {
    this.expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
}
