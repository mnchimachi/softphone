import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Phone, PhoneOff, User, Building2, FileSpreadsheet, DollarSign } from 'lucide-react';

export function CallInterface() {
  const { currentContact, addCallLog, removeContact } = useStore();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval: number;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCall = () => {
    if (!isCallActive) {
      setIsCallActive(true);
      setCallDuration(0);
    } else {
      setIsCallActive(false);
      if (currentContact) {
        addCallLog({
          telefone: currentContact.telefone,
          duracao: callDuration,
          status: 'sucesso',
          timestamp: new Date(),
          socioNome: currentContact.socioNome,
          cnpj: currentContact.cnpj,
          empresaNome: currentContact.empresaNome,
          notas: notes.trim()
        });
        removeContact(currentContact);
        setNotes('');
      }
    }
  };

  if (!currentContact) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">Selecione um contato para iniciar uma chamada</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold">{currentContact.socioNome}</h3>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="w-4 h-4" />
          <span>{currentContact.empresaNome}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <FileSpreadsheet className="w-4 h-4" />
          <span>CNPJ: {currentContact.cnpj}</span>
        </div>

        <div className="flex items-center gap-2 text-blue-600">
          <Phone className="w-4 h-4" />
          <span>{currentContact.telefone}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Previdenciário</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(currentContact.previdenciario)}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Simples Nacional</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(currentContact.simplesNacional)}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Demais Débitos</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(currentContact.demaisDebitos)}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Valor Total</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(currentContact.valorTotal)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anotações da ligação
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Digite suas anotações sobre a ligação aqui..."
          />
        </div>

        {isCallActive && (
          <div className="text-center py-2">
            <p className="text-lg font-semibold">
              {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
            </p>
          </div>
        )}

        <button
          onClick={handleCall}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-white transition-colors ${
            isCallActive
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isCallActive ? (
            <>
              <PhoneOff className="w-5 h-5" />
              Encerrar Chamada
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Iniciar Chamada
            </>
          )}
        </button>
      </div>
    </div>
  );
}