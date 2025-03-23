#!/bin/bash

# Criar diretório temporário
mkdir -p temp_export

# Copiar arquivos principais
cp package.json temp_export/
cp vite.config.ts temp_export/
cp tsconfig.json temp_export/
cp tsconfig.app.json temp_export/
cp tsconfig.node.json temp_export/
cp tailwind.config.js temp_export/
cp postcss.config.js temp_export/
cp .env.example temp_export/

# Copiar scripts de deploy
cp deploy.sh temp_export/
cp install.sh temp_export/
cp nginx.conf temp_export/
cp ecosystem.config.js temp_export/

# Copiar diretório src
cp -r src temp_export/

# Criar arquivo zip
zip -r softphone-export.zip temp_export/*

# Limpar diretório temporário
rm -rf temp_export

echo "Projeto exportado para softphone-export.zip"