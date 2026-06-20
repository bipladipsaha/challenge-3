import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error({ err }, 'Redis Client Error'));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export const connectRedis = async () => {
  if (env.REDIS_URL) {
    try {
      await redisClient.connect();
    } catch (err) {
      logger.error({ err }, 'Failed to connect to Redis');
    }
  } else {
    logger.warn('REDIS_URL not provided. Caching will be disabled/mocked.');
  }
};
