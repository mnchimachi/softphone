import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import JsSIP from 'jssip';
import { v4 as uuidv4 } from 'uuid';

interface CallSession {
  id: string;
  ua: JsSIP.UA;
  session: JsSIP.RTCSession | null;
  status: string;
}

class HttpSipGateway {
  private io: Server;
  private app: express.Express;
  private server: any;
  private activeCalls: Map<string, CallSession>;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.activeCalls = new Map();

    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupRoutes() {
    this.app.post('/api/call', express.json(), (req, res) => {
      const { from, to, sipConfig } = req.body;
      
      try {
        const callId = this.initiateCall(from, to, sipConfig);
        res.json({ callId, status: 'initiating' });
      } catch (error) {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Erro ao iniciar chamada' 
        });
      }
    });

    this.app.post('/api/hangup/:callId', (req, res) => {
      const { callId } = req.params;
      const call = this.activeCalls.get(callId);
      
      if (!call) {
        return res.status(404).json({ error: 'Chamada não encontrada' });
      }

      try {
        if (call.session) {
          call.session.terminate();
        }
        call.ua.stop();
        this.activeCalls.delete(callId);
        res.json({ status: 'terminated' });
      } catch (error) {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Erro ao encerrar chamada' 
        });
      }
    });

    this.app.get('/api/status/:callId', (req, res) => {
      const { callId } = req.params;
      const call = this.activeCalls.get(callId);
      
      if (!call) {
        return res.status(404).json({ error: 'Chamada não encontrada' });
      }

      res.json({ status: call.status });
    });

    this.app.get('/health', (_, res) => {
      res.json({ status: 'ok' });
    });
  }

  private setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado ao gateway HTTP-SIP');

      socket.on('subscribe', (callId: string) => {
        socket.join(`call:${callId}`);
      });

      socket.on('unsubscribe', (callId: string) => {
        socket.leave(`call:${callId}`);
      });
    });
  }

  private initiateCall(from: string, to: string, sipConfig: any): string {
    const callId = uuidv4();

    const configuration = {
      uri: `sip:${from}@${sipConfig.servidor}`,
      password: sipConfig.senha,
      display_name: sipConfig.nomeConta || from,
      sockets: [
        {
          socket: new JsSIP.WebSocketInterface(`ws://${sipConfig.servidor}:5060`),
          via_transport: sipConfig.transport || 'udp'
        }
      ],
      register: true,
      registrar_server: `sip:${sipConfig.servidor}:5060`,
      register_expires: 300,
      connection_recovery_min_interval: 2,
      connection_recovery_max_interval: 30,
      hack_via_tcp: true,
      hack_ip_in_contact: true,
      session_timers: false,
      no_answer_timeout: 60
    };

    const ua = new JsSIP.UA(configuration);

    const callSession: CallSession = {
      id: callId,
      ua,
      session: null,
      status: 'initializing'
    };

    this.setupUAListeners(ua, callId);
    this.activeCalls.set(callId, callSession);

    ua.start();
    
    ua.on('registered', () => {
      const session = ua.call(`sip:${to}@${sipConfig.servidor}`, {
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false }
      });

      callSession.session = session;
      this.setupSessionListeners(session, callId);
    });

    return callId;
  }

  private setupUAListeners(ua: JsSIP.UA, callId: string) {
    ua.on('connected', () => {
      this.updateCallStatus(callId, 'connected');
    });

    ua.on('disconnected', (error: any) => {
      this.updateCallStatus(callId, 'disconnected', error?.message);
    });

    ua.on('registered', () => {
      this.updateCallStatus(callId, 'registered');
    });

    ua.on('registrationFailed', (e: any) => {
      this.updateCallStatus(callId, 'registration_failed', e.cause);
    });

    ua.on('newRTCSession', (data: { session: JsSIP.RTCSession }) => {
      if (!data.session.isEstablished() && data.session.direction === 'incoming') {
        this.setupSessionListeners(data.session, uuidv4());
      }
    });
  }

  private setupSessionListeners(session: JsSIP.RTCSession, callId: string) {
    session.on('connecting', () => {
      this.updateCallStatus(callId, 'connecting');
    });

    session.on('accepted', () => {
      this.updateCallStatus(callId, 'accepted');
    });

    session.on('ended', (e: any) => {
      this.updateCallStatus(callId, 'ended', e.cause);
    });

    session.on('failed', (e: any) => {
      this.updateCallStatus(callId, 'failed', e.cause);
    });
  }

  private updateCallStatus(callId: string, status: string, error?: string) {
    const call = this.activeCalls.get(callId);
    if (call) {
      call.status = status;
      this.io.to(`call:${callId}`).emit('callStatus', { status, error });
    }
  }

  public start(port: number = 3000) {
    this.server.listen(port, '0.0.0.0', () => {
      console.log(`Gateway HTTP-SIP rodando na porta ${port}`);
    });
  }
}

export const gateway = new HttpSipGateway();
