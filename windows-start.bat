@echo off
echo Iniciando Softphone VoIP...

:: Iniciar gateway em uma nova janela
start "Gateway SIP" cmd /k "npm run gateway"

:: Aguardar um pouco para o gateway iniciar
timeout /t 3 /nobreak >nul

:: Iniciar frontend
npm run dev