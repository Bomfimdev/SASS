const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import middleware
const { tenantMiddleware } = require('./api/middleware/tenantMiddleware');

// Import routes
const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');
const proposalRoutes = require('./api/routes/proposal.routes');
const clientRoutes = require('./api/routes/client.routes');
const analyticsRoutes = require('./api/routes/analytics.routes');

// Import config
const { PORT, NODE_ENV } = require('./config/config');
const { sequelize } = require('./config/database');

// Setup logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'commercial-proposals-api' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

// Initialize express app
const app = express();

// Apply middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply tenant middleware to all routes except auth
app.use('/api/auth', authRoutes);
app.use('/api/*', tenantMiddleware);
app.use('/api/users', userRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Sync database (in development only)
    if (NODE_ENV === 'development') {
      await sequelize.sync();
      logger.info('Database synchronized successfully.');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;