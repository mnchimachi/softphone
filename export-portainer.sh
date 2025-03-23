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
cp portainer-stack.yml temp_export/docker-compose.yml

# Copiar diretórios
cp -r src temp_export/
cp -r public temp_export/ 2>/dev/null || true
cp -r supabase temp_export/

# Criar arquivo .env de exemplo
cat > temp_export/.env << EOL
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
NODE_ENV=production
PORT=3002
VITE_APP_PORT=8082
EOL

# Criar arquivo README para implantação
cat > temp_export/README.md << EOL
# Softphone VoIP - Instruções de Implantação

## Pré-requisitos
- Portainer
- Traefik configurado
- Rede Docker 'softphone_network' criada

## Passos para Implantação

1. No Portainer, vá para Stacks > Add Stack

2. Configure as variáveis de ambiente:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

3. Cole o conteúdo do arquivo docker-compose.yml

4. Clique em Deploy the stack

## Portas Utilizadas
- 3002: Gateway SIP (TCP/UDP)
- 8082: Frontend
- 5060: SIP padrão (UDP)
- 10000-10010: RTP media (UDP)

## URLs
- Frontend: https://softphone.vendananet.com.br
- Gateway: https://gateway.softphone.vendananet.com.br
EOL

# Criar arquivo zip
zip -r softphone-portainer.zip temp_export/*

# Limpar diretório temporário
rm -rf temp_export

echo "Projeto exportado para softphone-portainer.zip"
echo "Instruções de implantação estão no README.md dentro do arquivo zip"