// PM2 Ecosystem Configuration File
// This file configures PM2 process manager for House of Raw backend
// 
// Usage:
// pm2 start ecosystem.config.js --env production
// pm2 start ecosystem.config.js --env development
// pm2 reload ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      // Application name
      name: 'houseofraw-api',
      
      // Script to execute
      script: './server.js',
      
      // Working directory
      cwd: '/var/www/houseofraw/backend',
      
      // Instances
      instances: 1, // or 'max' for cluster mode
      exec_mode: 'fork', // or 'cluster' for multiple instances
      
      // Watch for file changes (disable in production)
      watch: false,
      
      // Ignore watch
      ignore_watch: [
        'node_modules',
        'logs',
        '*.log',
        '.git'
      ],
      
      // Auto restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Memory management
      max_memory_restart: '500M',
      
      // Logging
      error_file: '/var/www/houseofraw/logs/pm2-error.log',
      out_file: '/var/www/houseofraw/logs/pm2-out.log',
      log_file: '/var/www/houseofraw/logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Merge logs
      merge_logs: true,
      
      // Environment variables - Production
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Environment variables - Development
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Source map support
      source_map_support: true,
      
      // Process management
      shutdown_with_message: true,
      
      // Restart delay
      restart_delay: 4000,
      
      // Cron restart (optional - restart every day at 3 AM)
      // cron_restart: '0 3 * * *',
      
      // Post deployment commands (optional)
      // post_update: ['npm install', 'echo Deployment finished']
    }
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-droplet-ip', // Change this
      ref: 'origin/main',
      repo: 'git@github.com:YOUR_USERNAME/houseOfRaw.git', // Change this
      path: '/var/www/houseofraw',
      'post-deploy': 'cd backend && npm install --production && pm2 reload ecosystem.config.js --env production && cd ../frontend && npm install && npm run build',
      'pre-setup': 'apt-get install git'
    }
  }
};
