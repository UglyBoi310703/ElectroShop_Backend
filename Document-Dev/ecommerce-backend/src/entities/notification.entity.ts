import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
    ForeignKey,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
@Index('idx_user_id', ['userId'])
@Index('idx_is_read', ['isRead'])
export class Notification {
    @PrimaryGeneratedColumn({ name: 'notification_id' })
    notificationId: number;

    @Column({ name: 'user_id' })
    @ForeignKey(() => User)
    userId: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'enum',
        enum: ['order', 'promotion', 'system', 'product', 'review'],
    })
    type: string;

    @Column({ name: 'related_id', nullable: true })
    relatedId: number;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
