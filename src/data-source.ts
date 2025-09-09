// data-source.ts
import { DataSource } from 'typeorm';
import { Env } from './config/env';

export default new DataSource({
  type: 'postgres',
  host: Env.DATABASE_HOST,
  port: Env.DATABASE_PORT,
  username: Env.DATABASE_USERNAME,
  password: Env.DATABASE_PASSWORD,
  database: Env.DATABASE_NAME,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: true,
    ca: Env.DATABASE_SSL_CA,
  },
});
