import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
    @PrimaryGeneratedColumn({ name: 'history_id' })
    historyId: number;

    @Column({ name: 'order_id' })
    orderId: number;

    @Column({ name: 'old_status', length: 50, nullable: true })
    oldStatus: string;

    @Column({ name: 'new_status', length: 50 })
    newStatus: string;

    @Column({ type: 'text', nullable: true })
    note: string;

    @Column({ name: 'changed_by', nullable: true })
    changedBy: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Order, (order) => order.statusHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'changed_by' })
    changedByUser: User;
}
