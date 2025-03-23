import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SipConfig } from '../types/Contact';

export function useHttpSip() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.PROD 
      ? 'https://38.242.151.49:3002'
      : 'http://localhost:3000';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to HTTP-SIP gateway');
    });

    newSocket.on('callStatus', (data) => {
      setStatus(data.status);
      setError(data.error || null);
    });

    setSocket(newSocket);

    return () => {
      if (activeCallId) {
        newSocket.emit('unsubscribe', activeCallId);
      }
      newSocket.disconnect();
    };
  }, [activeCallId]);

  const makeCall = useCallback(async (from: string, to: string, sipConfig: SipConfig) => {
    try {
      const baseUrl = import.meta.env.PROD 
        ? 'https://38.242.151.49:3002'
        : 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to, sipConfig })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar chamada');
      }

      setActiveCallId(data.callId);
      socket?.emit('subscribe', data.callId);
      
      return data.callId;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }, [socket]);

  const hangupCall = useCallback(async () => {
    if (!activeCallId) return;

    try {
      const baseUrl = import.meta.env.PROD 
        ? 'https://38.242.151.49:3002'
        : 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/hangup/${activeCallId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao encerrar chamada');
      }

      socket?.emit('unsubscribe', activeCallId);
      setActiveCallId(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }, [activeCallId, socket]);

  return {
    status,
    error,
    makeCall,
    hangupCall,
    isCallActive: !!activeCallId
  };
}