import io from 'socket.io-client'; // Correção aqui
import type { SipConfig } from '../types/Contact';

export class SipClient {
  private socket: SocketIOClient.Socket; // Ajuste o tipo conforme necessário
  private connectionTimeout: number = 10000; // 10 segundos timeout
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  constructor() {
    const socketUrl = import.meta.env.PROD 
      ? 'https://38.242.151.49:3002'
      : 'http://localhost:3000';

    this.socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: this.connectionTimeout,
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emitStatus('error', 'Não foi possível conectar ao servidor SIP local após várias tentativas');
      } else {
        this.emitStatus('error', 'Tentando reconectar ao servidor SIP local...');
      }
    });

    this.socket.on('connect_timeout', () => {
      console.error('Socket connection timeout');
      this.emitStatus('error', 'Timeout na conexão com servidor SIP local');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Reconectar se o servidor desconectou
        this.socket.connect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emitStatus('error', 'Erro na conexão com servidor SIP local');
    });
  }

  private emitStatus(status: string, error?: string) {
    if (this.socket.connected) {
      this.socket.emit('sipStatus', { status, error });
    }
  }

  async connect(config: SipConfig) {
    try {
      if (!this.socket.connected) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout ao conectar ao servidor'));
          }, this.connectionTimeout);

          this.socket.connect();
          this.socket.once('connect', () => {
            clearTimeout(timeout);
            resolve();
          });
        });
      }

      this.socket.emit('sipConnect', config);
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async makeCall(destination: string, config: SipConfig) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout ao tentar realizar chamada'));
      }, this.connectionTimeout);

      try {
