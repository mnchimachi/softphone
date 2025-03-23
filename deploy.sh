#!/bin/bash

# Atualizar o sistema
apt-get update && apt-get upgrade -y

# Instalar Node.js e npm se não estiverem instalados
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Instalar PM2 globalmente
npm install -g pm2

# Instalar dependências do projeto
npm install

# Build do frontend
npm run build

# Iniciar aplicação com PM2
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup

# Exibir status
pm2 status