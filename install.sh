#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Iniciando instalação do Softphone...${NC}"

# Criar diretório da aplicação
echo -e "${GREEN}Criando diretório da aplicação...${NC}"
sudo mkdir -p /var/www/softphone
sudo chown -R $USER:$USER /var/www/softphone

# Copiar arquivos para o diretório
echo -e "${GREEN}Copiando arquivos...${NC}"
cp -r * /var/www/softphone/

# Entrar no diretório
cd /var/www/softphone

# Instalar dependências do projeto
echo -e "${GREEN}Instalando dependências do projeto...${NC}"
npm install

# Verificar se PM2 já está instalado (provavelmente está pelo Whaticket)
if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}Instalando PM2...${NC}"
    sudo npm install -g pm2
fi

# Configurar Nginx
echo -e "${GREEN}Configurando Nginx...${NC}"
sudo cp nginx.conf /etc/nginx/sites-available/softphone
sudo ln -s /etc/nginx/sites-available/softphone /etc/nginx/sites-enabled/ 2>/dev/null || true
sudo nginx -t && sudo systemctl reload nginx

# Build do projeto
echo -e "${GREEN}Buildando o projeto...${NC}"
npm run build

# Iniciar com PM2
echo -e "${GREEN}Iniciando aplicação com PM2...${NC}"
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

echo -e "${GREEN}Instalação concluída!${NC}"
echo -e "${GREEN}Acesse: http://seu-ip:8080${NC}"