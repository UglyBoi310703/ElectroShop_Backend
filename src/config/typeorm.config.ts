import { DataSource } from 'typeorm';
import configuration from './configuration';

const config = configuration();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST ?? config.database.host,
  port: Number(process.env.DATABASE_PORT ?? config.database.port),
  username: process.env.DATABASE_USER ?? config.database.username,
  password: process.env.DATABASE_PASSWORD ?? config.database.password,
  database: process.env.DATABASE_NAME ?? config.database.name,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default dataSource;
