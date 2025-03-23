import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import JsSIP from 'jssip';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Configure JsSIP debug
JsSIP.debug.enable('JsSIP:*');

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  let currentUA = null;

  socket.on('sipConnect', (config) => {
    try {
      if (currentUA) {
        currentUA.stop();
      }

      // Configure SIP UA with WebSocket transport
      const configuration = {
        uri: `sip:${config.usuario}@${config.dominio}`,
        password: config.senha,
        display_name: config.nomeConta,
        register: true,
        registrar_server: `sip:${config.servidor}`,
        ws_servers: [`wss://${config.servidor}:7443/ws`],
        register_expires: 300,
        use_preloaded_route: true,
        connection_recovery_min_interval: 2,
        connection_recovery_max_interval: 30,
        hack_via_tcp: true,
        hack_ip_in_contact: true
      };

      const ua = new JsSIP.UA(configuration);
      currentUA = ua;
      
      ua.start();

      // UA Events
      ua.on('connected', () => {
        console.log('UA Connected');
        socket.emit('sipStatus', { status: 'connected' });
      });

      ua.on('disconnected', () => {
        console.log('UA Disconnected');
        socket.emit('sipStatus', { status: 'disconnected' });
      });

      ua.on('registered', () => {
        console.log('UA Registered');
        socket.emit('sipStatus', { status: 'registered' });
      });

      ua.on('registrationFailed', (e) => {
        console.error('Registration failed:', e);
        socket.emit('sipStatus', { 
          status: 'error', 
          error: `Falha no registro: ${e.cause}` 
        });
      });

      ua.on('registrationExpiring', () => {
        console.log('Registration expiring, renewing...');
        ua.register();
      });

    } catch (error) {
      console.error('SIP connection error:', error);
      socket.emit('sipStatus', { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Erro desconhecido na conexão' 
      });
    }
  });

  // Handle SIP calls
  socket.on('sipCall', async (data) => {
    const { destination, config } = data;
    
    try {
      if (!currentUA) {
        throw new Error('Cliente SIP não inicializado');
      }

      const session = currentUA.call(destination, {
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false }
      });

      session.on('connecting', () => {
        console.log('Call connecting');
        socket.emit('sipStatus', { status: 'connecting' });
      });

      session.on('accepted', () => {
        console.log('Call accepted');
        socket.emit('sipStatus', { status: 'accepted' });
      });

      session.on('ended', () => {
        console.log('Call ended');
        socket.emit('sipStatus', { status: 'ended' });
      });

      session.on('failed', (e) => {
        console.error('Call failed:', e);
        socket.emit('sipStatus', { 
          status: 'failed', 
          error: `Chamada falhou: ${e.cause}` 
        });
      });

    } catch (error) {
      console.error('Call error:', error);
      socket.emit('sipStatus', { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Erro ao realizar chamada' 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (currentUA) {
      currentUA.stop();
      currentUA = null;
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`SIP Gateway running on port ${PORT}`);
});