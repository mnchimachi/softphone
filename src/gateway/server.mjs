
import JsSIP from 'jssip';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const httpServer = createServer();
const TIMEOUT = 10000; // 10 segundos

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket', 'polling']
});

// Configuração detalhada de logs
JsSIP.debug.enable('JsSIP:*');
const logger = {
  debug: (...args) => console.debug('[SIP Debug]', ...args),
  log: (...args) => console.log('[SIP Log]', ...args),
  warn: (...args) => console.warn('[SIP Warn]', ...args),
  error: (...args) => console.error('[SIP Error]', ...args)
};

io.on('connection', (socket) => {
  let currentUA = null;

  socket.on('sipConnect', (config) => {
    try {
      if (currentUA) currentUA.stop();

      // Configuração avançada do UA
      const configuration = {
        uri: `sip:${config.usuario}@${config.dominio}`,
        password: config.senha,
        display_name: config.nomeConta,
        register: true,
        register_expires: 300,

        // Múltiplos transportes com fallback
        sockets: [
          { uri: `wss://${config.servidor}:5060/ws` },
          { uri: `tcp://${config.servidor}:5060` }
        ],

        // Configurações de recuperação
        connection_recovery_min_interval: 2,
        connection_recovery_max_interval: 30,
        connection_recovery_attempts: 3,

        // Configurações de mídia WebRTC
        rtc_constraints: {
          optional: [
            { DtlsSrtpKeyAgreement: true },
            { googIPv6: true }
          ]
        },

        // Prioridade de codecs
        media_constraints: {
          audio: {
            codecs: ['PCMU', 'PCMA', 'opus'],
            codecPayloads: {
              PCMU: 0,
              PCMA: 8,
              opus: 111
            }
          },
          video: false
        },

        // Configurações STUN/TURN
        stun_servers: ['stun:stun.l.google.com:19302'],
        turn_servers: [
          {
            urls: ['turn:seu-servidor-turn:3478'],
            username: 'user',
            credential: 'pass'
          }
        ]
      };

      const ua = new JsSIP.UA(configuration);
      currentUA = ua;

      // Timeout para conexão
      const connectionTimeout = setTimeout(() => {
        socket.emit('sipStatus', {
          status: 'error',
          error: 'Timeout na conexão SIP'
        });
        ua.stop();
      }, TIMEOUT);

      // Handlers de eventos
      ua.on('connected', () => {
        clearTimeout(connectionTimeout);
        logger.log('UA Conectado');
        socket.emit('sipStatus', { status: 'connected' });
      });

      ua.on('disconnected', () => {
        logger.warn('UA Desconectado');
        socket.emit('sipStatus', { status: 'disconnected' });
      });

      ua.on('registered', () => {
        logger.log('UA Registrado');
        socket.emit('sipStatus', { status: 'registered' });
      });

      ua.on('registrationFailed', (e) => {
        logger.error('Falha no registro:', e);
        if (e.status_code === 407) {
          socket.emit('sipStatus', {
            status: 'error',
            error: 'Autenticação proxy requerida'
          });
        } else {
          socket.emit('sipStatus', {
            status: 'error',
            error: `Falha no registro: ${e.cause}`
          });
        }
      });

      // Log detalhado de mensagens SIP
      ua.on('newMessage', (e) => {
        logger.debug('Nova mensagem SIP:', {
          type: e.originator,
          message: e.message
        });
      });

      ua.start();

    } catch (error) {
      logger.error('Erro na conexão SIP:', error);
      socket.emit('sipStatus', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  });

  // Gerenciamento de chamadas
  socket.on('sipCall', (data) => {
    if (!currentUA) {
      socket.emit('sipStatus', {
        status: 'error',
        error: 'Cliente SIP não inicializado'
      });
      return;
    }

    try {
      const session = currentUA.call(data.destination, {
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        }
      });

      // Log de negociação SDP
      session.on('sdp', (e) => {
        logger.debug('Negociação SDP:', {
          type: e.originator,
          sdp: e.sdp
        });
      });

      session.on('connecting', () => {
        socket.emit('sipStatus', { status: 'connecting' });
      });

      session.on('accepted', () => {
        socket.emit('sipStatus', { status: 'accepted' });
      });

      session.on('failed', (e) => {
        socket.emit('sipStatus', {
          status: 'error',
          error: `Chamada falhou: ${e.cause}`
        });
      });

    } catch (error) {
      logger.error('Erro ao realizar chamada:', error);
      socket.emit('sipStatus', {
        status: 'error',
        error: 'Erro ao iniciar chamada'
      });
    }
  });
});

httpServer.listen(3002, '0.0.0.0', () => {
  console.log('Gateway SIP rodando na porta 3002');
});
