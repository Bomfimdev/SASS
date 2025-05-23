const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/config');
const { setTenantSchema } = require('../../config/database');
const logger = require('../../utils/logger');

/**
 * Multi-tenant middleware that ensures data isolation between tenants
 * Works by extracting tenant ID from JWT token and setting the correct PostgreSQL schema
 */
const tenantMiddleware = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded || !decoded.tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or tenant information',
      });
    }

    // Extract tenant ID and set in request object for further use
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    
    // Set schema for the database operations
    const schemaName = `tenant_${decoded.tenantId}`;
    const success = await setTenantSchema(schemaName);
    
    if (!success) {
      logger.error(`Failed to set schema for tenant ${decoded.tenantId}`);
      return res.status(500).json({
        success: false,
        message: 'Internal server error: Failed to set tenant context',
      });
    }

    // All good, proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    logger.error('Tenant middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { tenantMiddleware };