import { useState, useEffect, useCallback } from 'react';
import { SipClient } from '../gateway/client';
import { useStore } from '../store/useStore';

export function useSip() {
  const [client, setClient] = useState<SipClient | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const { sipConfig } = useStore();

  useEffect(() => {
    const sipClient = new SipClient();
    setClient(sipClient);

    sipClient.onCallStatus((statusUpdate) => {
      console.log('SIP Status Update:', statusUpdate);
      
      if (statusUpdate.error) {
        setError(statusUpdate.error instanceof Error ? statusUpdate.error.message : String(statusUpdate.error));
        setStatus('error');
      } else {
        setStatus(statusUpdate.status);
        setError(null);
      }
    });

    return () => {
      sipClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (sipConfig && client) {
      client.connect(sipConfig);
    }
  }, [sipConfig, client]);

  const makeCall = useCallback(async (destination: string) => {
    if (!client || !sipConfig) {
      setError('Cliente SIP não inicializado');
      return;
    }

    try {
      await client.makeCall(destination, sipConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar chamada');
      setStatus('error');
    }
  }, [client, sipConfig]);

  return {
    status,
    error,
    makeCall
  };
}