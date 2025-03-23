import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Settings, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useSip } from '../hooks/useWebRTC';

export function SipConfig() {
  const { sipConfig, setSipConfig, setSipStatus } = useStore();
  const { status, error } = useSip();
  const [formData, setFormData] = useState({
    nomeConta: 'Softphone BRDID',
    usuario: '5122890548',
    login: '5122890548',
    senha: 'cjwx8',
    servidor: 'voz.sobreip.com.br',
    proxySip: 'voz.sobreip.com.br',
    dominio: 'voz.sobreip.com.br'
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (sipConfig) {
      setFormData(sipConfig);
    }
  }, [sipConfig]);

  useEffect(() => {
    if (status === 'connected') {
      setMessage({ type: 'success', text: 'Conexão SIP estabelecida com sucesso!' });
      setSipStatus({ connected: true });
      setTesting(false);
    } else if (status === 'disconnected') {
      setMessage({ type: 'error', text: 'Conexão perdida' });
      setSipStatus({ connected: false });
      setTesting(false);
    } else if (status === 'error') {
      setMessage({ 
        type: 'error', 
        text: `Erro na conexão: ${error || 'Erro desconhecido'}` 
      });
      setSipStatus({ connected: false });
      setTesting(false);
    }
  }, [status, error, setSipStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setMessage({ type: 'warning', text: 'Conectando ao servidor SIP...' });
    setSipConfig(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Configuração BRDID (Apenas Ligações)</h2>
        </div>
      </div>
      
      {message && (
        <div className={`mx-6 mt-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 
          message.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
          'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : message.type === 'warning' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome da Conta</label>
          <input
            type="text"
            value={formData.nomeConta}
            onChange={(e) => setFormData({ ...formData, nomeConta: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: Softphone BRDID"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuário</label>
            <input
              type="text"
              value={formData.usuario}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData({ 
                  ...formData, 
                  usuario: newValue,
                  login: newValue
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: 5122890548"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Login</label>
            <input
              type="text"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: 5122890548"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Digite sua senha"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Servidor SIP</label>
            <input
              type="text"
              value={formData.servidor}
              onChange={(e) => setFormData({ ...formData, servidor: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Proxy SIP</label>
            <input
              type="text"
              value={formData.proxySip}
              onChange={(e) => setFormData({ ...formData, proxySip: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Domínio</label>
          <input
            type="text"
            value={formData.dominio}
            onChange={(e) => setFormData({ ...formData, dominio: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status da Conexão</label>
          <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${testing ? 'bg-yellow-500' : status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">
                {testing ? 'Conectando...' : status === 'connected' ? 'Pronto para ligações' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={testing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Conectando...' : 'Conectar para Ligações'}
        </button>
      </form>
    </div>
  );
}