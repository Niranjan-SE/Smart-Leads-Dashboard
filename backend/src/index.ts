import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';
import usersRoutes from './routes/users';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: config.nodeEnv, timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadsRoutes);
app.use('/api/v1/users', usersRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer().catch(console.error);
