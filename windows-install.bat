@echo off
echo Instalando Softphone VoIP...

:: Verificar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js nao encontrado! Por favor, instale o Node.js v20 LTS de https://nodejs.org
    exit /b 1
)

:: Instalar dependências
echo Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias!
    exit /b 1
)

:: Criar arquivo .env se não existir
if not exist .env (
    echo Criando arquivo .env...
    copy .env.example .env
)

echo.
echo Instalacao concluida!
echo.
echo Para iniciar o sistema:
echo 1. Em uma janela do terminal: npm run gateway
echo 2. Em outra janela do terminal: npm run dev
echo.
echo Acesse:
echo Frontend: http://localhost:5173
echo Gateway: http://localhost:3002
echo.
pause