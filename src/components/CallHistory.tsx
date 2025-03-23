import React from 'react';
import { useStore } from '../store/useStore';
import { History, Phone, User, Building2, FileSpreadsheet, Clock, FileText } from 'lucide-react';

export function CallHistory() {
  const { callLogs } = useStore();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: Date) => {
    // Ensure we have a valid Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Sort logs in reverse chronological order
  const sortedLogs = [...callLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Histórico de Chamadas</h2>
          </div>

          <div className="space-y-4">
            {sortedLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma chamada realizada ainda.
              </p>
            ) : (
              sortedLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-semibold">{log.socioNome}</h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{log.empresaNome}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>CNPJ: {log.cnpj}</span>
                    </div>

                    <div className="flex items-center gap-2 text-blue-600">
                      <Phone className="w-4 h-4" />
                      <span>{log.telefone}</span>
                    </div>

                    {log.notas && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">Anotações da ligação:</span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{log.notas}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Duração: {formatDuration(log.duracao)}</span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-sm ${
                        log.status === 'sucesso' 
                          ? 'bg-green-100 text-green-800'
                          : log.status === 'falha'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status === 'sucesso' 
                          ? 'Concluída'
                          : log.status === 'falha'
                          ? 'Falha'
                          : 'Não Atendida'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}