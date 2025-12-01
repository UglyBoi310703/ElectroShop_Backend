import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'ecommerce_user',
    password: process.env.DB_PASSWORD || 'ecommerce_password',
    database: process.env.DB_DATABASE || 'ecommerce_db',
    entities: [path.join(__dirname, '../entities/**/*.entity{.ts,.js}')],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    charset: 'utf8mb4',
    timezone: '+07:00',
    extra: {
        connectionLimit: 10,
    },
};

export default config;
