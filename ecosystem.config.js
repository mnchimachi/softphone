module.exports = {
  apps: [
    {
      name: 'sip-gateway',
      script: 'src/gateway/server.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001  // Mudado de 3000 para 3001 para evitar conflito
      },
      error_file: '/var/log/pm2/sip-gateway-error.log',
      out_file: '/var/log/pm2/sip-gateway-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'softphone-frontend',  // Nome alterado para evitar conflito
      script: 'npm',
      args: 'run serve',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080  // Mudado de 80 para 8080
      },
      error_file: '/var/log/pm2/frontend-error.log',
      out_file: '/var/log/pm2/frontend-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};