import RedisImport from 'ioredis';
import { logger } from '../utils/logger.js';
const Redis = (RedisImport as any).default || RedisImport;

 const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

client.on('connect', () => {
  logger.info('Redis connected');
});

client.on('error', (err: any) => {
  console.log(err);
  logger.error('Redis error', err);
});

export { client };