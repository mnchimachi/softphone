# Softphone VoIP

Aplicação de Softphone VoIP com suporte a Docker e integração com Supabase.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 20+
- Docker (opcional)
- Conta no Supabase

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/softphone.git

# Entre na pasta do projeto
cd softphone

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Inicie o projeto em desenvolvimento
npm run dev
```

## 🐳 Docker

### Usando Docker Compose

```bash
# Construa e inicie os containers
docker compose up -d
```

### Usando Docker diretamente

```bash
# Construa a imagem
npm run docker:build

# Execute o container
npm run docker:run
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### Portas

- 3002: Gateway SIP
- 8082: Frontend

## 📦 Deploy com Portainer

1. Crie uma rede Docker:
   ```bash
   docker network create softphone_network
   ```

2. Use o arquivo `portainer-stack.yml` para deploy:
   - Substitua `seudominio.com.br` pelo seu domínio
   - Configure as variáveis de ambiente do Supabase
   - Deploy a stack no Portainer

## 🛠️ Desenvolvimento

```bash
# Modo desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run serve
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.