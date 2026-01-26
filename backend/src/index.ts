import dotenv from 'dotenv';
import createApp from './app';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  process.exit(0);
});