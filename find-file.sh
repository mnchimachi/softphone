#!/bin/bash

# Cores para melhor visualização
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Procurando por portainer-stack.yml...${NC}"

# Procurar o arquivo a partir da raiz
find / -name "portainer-stack.yml" 2>/dev/null

echo -e "\n${GREEN}Procurando por softphone-portainer.zip...${NC}"

# Procurar também o arquivo zip
find / -name "softphone-portainer.zip" 2>/dev/null