import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn({ name: 'brand_id' })
  brandId: number;

  @Column({ name: 'brand_name', length: 255 })
  brandName: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
