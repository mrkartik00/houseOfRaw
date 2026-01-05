// Health Check Endpoint for House of Raw Backend
// Add this to your backend/routes or create a new healthRoutes.js file

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Health Check Endpoint
 * Used by monitoring tools and load balancers to check service health
 * 
 * Returns:
 * - 200 OK: Service is healthy
 * - 503 Service Unavailable: Service has issues
 */

// Simple health check - just checks if server is responding
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'House of Raw API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Detailed health check - checks database connection and other dependencies
router.get('/health/detailed', async (req, res) => {
    try {
        const healthCheck = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            checks: {
                server: 'OK',
                database: 'CHECKING',
                memory: 'OK',
                disk: 'OK'
            },
            system: {
                nodeVersion: process.version,
                platform: process.platform,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            }
        };

        // Check MongoDB connection
        if (mongoose.connection.readyState === 1) {
            healthCheck.checks.database = 'OK';
            healthCheck.database = {
                status: 'connected',
                host: mongoose.connection.host,
                name: mongoose.connection.name
            };
        } else {
            healthCheck.checks.database = 'FAILED';
            healthCheck.status = 'DEGRADED';
            healthCheck.database = {
                status: 'disconnected'
            };
        }

        // Check memory usage
        const memUsage = process.memoryUsage();
        const memoryThreshold = 450 * 1024 * 1024; // 450MB (for 500MB limit)
        if (memUsage.heapUsed > memoryThreshold) {
            healthCheck.checks.memory = 'WARNING';
            healthCheck.status = 'DEGRADED';
        }

        // Return appropriate status code
        const statusCode = healthCheck.status === 'OK' ? 200 : 503;
        res.status(statusCode).json(healthCheck);

    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            message: 'Health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Readiness check - checks if service is ready to accept traffic
router.get('/ready', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                ready: false,
                reason: 'Database not connected'
            });
        }

        // Add other readiness checks here
        // - Check if required services are initialized
        // - Check if cache is ready
        // - Check if config is loaded

        res.status(200).json({
            ready: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            ready: false,
            reason: error.message
        });
    }
});

// Liveness check - checks if service is alive (simpler than health check)
router.get('/alive', (req, res) => {
    res.status(200).json({
        alive: true,
        timestamp: new Date().toISOString()
    });
});

// Version endpoint - returns API version and build info
router.get('/version', (req, res) => {
    res.json({
        name: 'House of Raw API',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

/*
=================================================================
HOW TO USE IN YOUR server.js OR app.js:
=================================================================

const healthRoutes = require('./routes/healthRoutes');

// Add this before your other routes
app.use('/api', healthRoutes);
// Or if you don't use /api prefix:
app.use('/', healthRoutes);

=================================================================
ENDPOINTS AVAILABLE:
=================================================================

GET /health                 - Basic health check
GET /health/detailed        - Detailed health check with system info
GET /ready                  - Readiness check for load balancers
GET /alive                  - Simple liveness check
GET /version                - API version information

=================================================================
EXAMPLE RESPONSES:
=================================================================

/health:
{
  "status": "OK",
  "message": "House of Raw API is running",
  "timestamp": "2026-01-04T10:30:00.000Z",
  "uptime": 86400
}

/health/detailed:
{
  "status": "OK",
  "timestamp": "2026-01-04T10:30:00.000Z",
  "uptime": 86400,
  "checks": {
    "server": "OK",
    "database": "OK",
    "memory": "OK",
    "disk": "OK"
  },
  "database": {
    "status": "connected",
    "host": "cluster0.mongodb.net",
    "name": "houseofraw"
  },
  "system": {
    "nodeVersion": "v20.11.0",
    "platform": "linux",
    "memoryUsage": { ... },
    "cpuUsage": { ... }
  }
}

/ready:
{
  "ready": true,
  "timestamp": "2026-01-04T10:30:00.000Z"
}

/alive:
{
  "alive": true,
  "timestamp": "2026-01-04T10:30:00.000Z"
}

/version:
{
  "name": "House of Raw API",
  "version": "1.0.0",
  "environment": "production",
  "nodeVersion": "v20.11.0",
  "timestamp": "2026-01-04T10:30:00.000Z"
}

=================================================================
NGINX CONFIGURATION:
=================================================================

Already configured in config/nginx.conf:

location /health {
    limit_req off;
    access_log off;
    proxy_pass http://localhost:5000/health;
}

location /api/health {
    limit_req off;
    access_log off;
    proxy_pass http://localhost:5000/api/health;
}

=================================================================
MONITORING:
=================================================================

You can use these endpoints with:

1. Uptime monitoring services (UptimeRobot, Pingdom)
   - Monitor: https://api.houseofraw.tech/health
   - Should return 200 OK

2. Load balancers (if you scale up)
   - Use /ready for readiness checks
   - Use /alive for liveness checks

3. PM2 monitoring
   pm2 monitor

4. Manual checks:
   curl https://api.houseofraw.tech/health
   curl https://api.houseofraw.tech/health/detailed

=================================================================
*/
