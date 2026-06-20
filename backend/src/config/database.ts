import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug({ query: e.query, duration: e.duration }, 'Prisma Query');
});

prisma.$on('error', (e) => {
  logger.error({ message: e.message }, 'Prisma Error');
});

prisma.$on('warn', (e) => {
  logger.warn({ message: e.message }, 'Prisma Warning');
});

export default prisma;
