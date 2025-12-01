import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'order_code', unique: true, length: 50 })
  orderCode: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'shipping_address_id' })
  shippingAddressId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ name: 'shipping_fee', type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingFee: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({
    name: 'order_status',
    type: 'enum',
    enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
  })
  orderStatus: string;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  })
  paymentStatus: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: ['cod', 'bank_transfer', 'credit_card', 'e_wallet', 'installment'],
  })
  paymentMethod: string;

  @Column({ name: 'customer_note', type: 'text', nullable: true })
  customerNote: string;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistory: OrderStatusHistory[];
}
