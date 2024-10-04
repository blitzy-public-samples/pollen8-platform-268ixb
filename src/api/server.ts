import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

/**
 * This file serves as the entry point for the Pollen8 API server, setting up the Express application,
 * configuring middleware, and starting the server.
 * 
 * Requirements addressed:
 * - Server Setup (Technical specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
 * - API Gateway (Technical specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
 * - Security Measures (Technical specification/9. SECURITY CONSIDERATIONS/9.3 SECURITY PROTOCOLS/9.3.1 API Security)
 */

const PORT = config.port || 3000;

/**
 * Starts the server and begins listening for incoming requests.
 */
async function startServer(): Promise<void> {
  try {
    app.listen(PORT, () => {
      logger.info(`Pollen8 API server is running on port ${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Implements graceful shutdown process for the server.
 */
function setupGracefulShutdown(): void {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    // Perform cleanup operations here (e.g., closing database connections)
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    // Perform cleanup operations here (e.g., closing database connections)
    process.exit(0);
  });
}

// Start the server
startServer();

// Setup graceful shutdown
setupGracefulShutdown();

// Export the app for testing purposes
export default app;