# Gateway WebRTC-to-SIP

Este é um gateway básico que permite a comunicação entre clientes WebRTC e servidores SIP. O gateway usa:

- MediaSoup para gerenciar as conexões WebRTC
- JsSIP para comunicação com servidores SIP
- Socket.IO para sinalização em tempo real

## Configuração

1. Atualize as configurações SIP em `server.js`:
   ```js
   const sipConfig = {
     uri: 'sip:gateway@seu-servidor-sip.com',
     password: 'sua-senha',
     ws_servers: ['wss://seu-servidor-sip.com:7443/ws'],
     register: true
   };
   ```

2. Configure o IP público do servidor no MediaSoup:
   ```js
   listenIps: [{ 
     ip: '0.0.0.0',
     announcedIp: 'SEU_IP_PÚBLICO'  // Importante para NAT traversal
   }]
   ```

## Limitações

1. Este é um gateway básico e pode precisar de ajustes para produção
2. Não inclui:
   - Autenticação de usuários
   - Criptografia E2E
   - Balanceamento de carga
   - Fallback para TCP/TLS
   - Gerenciamento de mídia avançado

## Uso

1. Inicie o gateway:
   ```bash
   npm run gateway
   ```

2. Conecte-se via WebSocket na porta 3000
3. Use os eventos 'join' e 'sipCall' para estabelecer chamadas