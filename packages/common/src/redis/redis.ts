import RedisImport from 'ioredis';
import { logger } from '../logger';


const Redis = (RedisImport as any).default || RedisImport;

let client: InstanceType<typeof Redis> | null = null;

export const connectRedis = async () => {
  if (client) {
    return client;
  }

  client = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
  );

  client.on('connect', () => {
    logger.info('Redis connected');
  });

  client.on('error', (err: any) => {
    logger.error({ err }, 'Redis error');
  });

  return client;
};

export const getRedisClient = () => {
  if (!client) {
    throw new Error(
      'Redis is not initialized. Call connectRedis() first.'
    );
  }

  return client;
};

export const closeRedis = async () => {
  if (!client) return;

  await client.quit();
  client = null;
};

// import RedisImport from 'ioredis';

// const Redis = (RedisImport as any).default || RedisImport;

// export const redisClient = new Redis(
//   process.env.REDIS_URL || 'redis://localhost:6379'
// );

// redisClient.on('connect', () => {
//   logger.info('Redis connected');
// });

// redisClient.on('error', (err: any) => {
//   logger.info(err);
// });