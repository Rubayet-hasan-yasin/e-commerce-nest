import { config } from 'dotenv';
import * as process from 'process';

config({ path: '.env' });

export const Env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),

  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_HOST: process.env.DB_HOST || 'localhost',
  DATABASE_PORT: parseInt(process.env.DB_PORT || '5050', 10),
  DATABASE_USERNAME: process.env.DB_USERNAME || '',
  DATABASE_PASSWORD: process.env.DB_PASSWORD || '',
  DATABASE_NAME: process.env.DB_NAME || 'test-db',
  DATABASE_SSL_CA: process.env.DATABASE_SSL_CA,

  JWT_SECRET: process.env.JWT_SECRET || 'default_secret5484857hdh^&*8jg4u',
  JWT_EXPIRED: process.env.JWT_EXPIRED || '15m',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),

  API_KEY: process.env.API_KEY || '',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),

  DOMAIN: process.env.DOMAIN || '',

  AUTH_OTP_EXPIRED: process.env.AUTH_OTP_EXPIRED || '300',

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL,
};
