import React from 'react';
import { useStore } from '../store/useStore';
import { Users, Phone, Building2, FileText, DollarSign } from 'lucide-react';

export function ContactList() {
  const { contacts, currentContact, setCurrentContact } = useStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Lista de Contatos</h2>
      </div>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Nenhum contato importado. Use o botão "Importar Contatos" para começar.
          </p>
        ) : (
          contacts.map((contact, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                currentContact === contact
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50 border-transparent'
              } border`}
              onClick={() => setCurrentContact(contact)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{contact.socioNome}</h3>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Phone className="w-4 h-4" />
                    <span className="ml-1 text-sm">{contact.telefone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{contact.empresaNome}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">CNPJ: {contact.cnpj}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Previdenciário</p>
                    <p className="font-medium text-green-600">{formatCurrency(contact.previdenciario)}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Simples Nacional</p>
                    <p className="font-medium text-green-600">{formatCurrency(contact.simplesNacional)}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Demais Débitos</p>
                    <p className="font-medium text-green-600">{formatCurrency(contact.demaisDebitos)}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Valor Total</p>
                    <p className="font-medium text-green-600">{formatCurrency(contact.valorTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}