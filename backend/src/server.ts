import express, { Express } from 'express';
import { connectRedis } from './config/redis';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './config/swagger';
import { rateLimiter } from './middlewares/rateLimiter';
import v1Router from './routes/v1';

const app: Express = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Logging Middleware
app.use(
  pinoHttp({
    logger,
    customProps: (req, res) => ({
      reqId: req.id,
    }),
  })
);

// Body parsing and Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
app.use('/api', rateLimiter);

// API Documentation
setupSwagger(app);

// Routes
app.use('/api/v1', v1Router);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = env.PORT || 5000;

const startServer = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
