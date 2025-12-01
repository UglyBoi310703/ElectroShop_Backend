import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ForeignKey,
} from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
@Index('idx_user_id', ['userId'])
export class Address {
    @PrimaryGeneratedColumn({ name: 'address_id' })
    addressId: number;

    @Column({ name: 'user_id' })
    @ForeignKey(() => User)
    userId: number;

    @Column({ name: 'recipient_name', length: 255 })
    recipientName: string;

    @Column({ length: 20 })
    phone: string;

    @Column({ type: 'text' })
    addressLine: string;

    @Column({ length: 100, nullable: true })
    ward: string;

    @Column({ length: 100, nullable: true })
    district: string;

    @Column({ length: 100 })
    city: string;

    @Column({ name: 'postal_code', length: 20, nullable: true })
    postalCode: string;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    @Column({
        name: 'address_type',
        type: 'enum',
        enum: ['home', 'office', 'other'],
        default: 'home',
    })
    addressType: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
