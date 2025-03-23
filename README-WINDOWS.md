# Instalação do Softphone no Windows

## Pré-requisitos

1. Node.js
   - Baixe e instale o Node.js v20 LTS de https://nodejs.org
   - Durante a instalação, marque a opção para instalar ferramentas de build

2. Git (opcional, mas recomendado)
   - Baixe e instale de https://git-scm.com/download/windows

## Passos para Instalação

1. Baixe o projeto
   ```bash
   git clone <seu-repositorio>
   # OU baixe o ZIP e extraia
   ```

2. Abra o Prompt de Comando como administrador e navegue até a pasta do projeto
   ```bash
   cd caminho/para/o/projeto
   ```

3. Instale as dependências
   ```bash
   npm install
   ```

4. Crie o arquivo .env
   ```bash
   copy .env.example .env
   ```

5. Configure as variáveis no arquivo .env:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

## Executando o Projeto

1. Em uma janela do terminal, inicie o gateway SIP:
   ```bash
   npm run gateway
   ```

2. Em outra janela do terminal, inicie o frontend:
   ```bash
   npm run dev
   ```

3. Acesse o sistema em:
   - Frontend: http://localhost:5173
   - Gateway: http://localhost:3002

## Portas Utilizadas

- 3002: Gateway SIP
- 5173: Frontend (desenvolvimento)
- 8082: Frontend (produção)
- 5060: SIP padrão (UDP)
- 10000-10010: RTP media (UDP)

## Solução de Problemas

1. Se houver erro de EACCES ou porta em uso:
   - Verifique se as portas não estão sendo usadas por outros programas
   - Use o Gerenciador de Tarefas para encerrar processos que possam estar usando as portas

2. Se o Node.js não for reconhecido:
   - Verifique se o Node.js está nas variáveis de ambiente do Windows
   - Reinicie o Prompt de Comando após a instalação

3. Se houver problemas com o WebRTC:
   - Verifique se está usando um navegador moderno (Chrome, Edge, Firefox)
   - Permita o acesso ao microfone quando solicitado

4. Se o gateway SIP não conectar:
   - Verifique se o firewall do Windows não está bloqueando
   - Configure exceções no firewall para as portas necessárias