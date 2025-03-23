import React, { useRef } from 'react';
import { read, utils } from 'xlsx';
import { useStore } from '../store/useStore';
import { Upload, Trash2 } from 'lucide-react';

export function ExcelImport() {
  const { setContacts, contacts } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para normalizar texto (remover acentos e converter para minúsculas)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      // Função para encontrar a chave correta independente de maiúsculas/minúsculas e acentos
      const findKey = (obj: any, targetKey: string): string | undefined => {
        const normalizedTarget = normalizeText(targetKey);
        return Object.keys(obj).find(key => 
          normalizeText(key) === normalizedTarget
        );
      };

      // Lista de possíveis variações para cada campo
      const fieldVariations = {
        cnpj: ['cnpj', 'CNPJ'],
        razaoSocial: ['razao social', 'razaosocial', 'razão social', 'nome empresa', 'empresa'],
        telefone: ['telefone', 'fone', 'tel', 'celular'],
        socio: ['socio', 'sócio', 'socios', 'sócios', 'responsavel', 'responsável'],
        previdenciario: ['previdenciario', 'previdenciário', 'prev', 'inss'],
        simplesNacional: ['simples nacional', 'simplesnacional', 'simples'],
        demaisDebitos: ['demais debitos', 'demais débitos', 'outros debitos', 'outros'],
        valorTotal: ['valor total', 'total', 'soma']
      };

      // Função para encontrar a primeira chave que corresponde a qualquer variação
      const findKeyFromVariations = (obj: any, variations: string[]): string | undefined => {
        for (const variation of variations) {
          const key = findKey(obj, variation);
          if (key) return key;
        }
        return undefined;
      };

      // Função para converter string de valor em número
      const parseValue = (value: any): number => {
        if (typeof value === 'number') return value;
        if (!value) return 0;
        // Remove R$, pontos e substitui vírgula por ponto
        const cleanValue = value.toString()
          .replace(/[R$]/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim();
        return Number(cleanValue) || 0;
      };

      setContacts(
        jsonData.map((row: any) => {
          const cnpjKey = findKeyFromVariations(row, fieldVariations.cnpj);
          const razaoKey = findKeyFromVariations(row, fieldVariations.razaoSocial);
          const telefoneKey = findKeyFromVariations(row, fieldVariations.telefone);
          const socioKey = findKeyFromVariations(row, fieldVariations.socio);
          const previdenciarioKey = findKeyFromVariations(row, fieldVariations.previdenciario);
          const simplesKey = findKeyFromVariations(row, fieldVariations.simplesNacional);
          const demaisDebitosKey = findKeyFromVariations(row, fieldVariations.demaisDebitos);
          const valorTotalKey = findKeyFromVariations(row, fieldVariations.valorTotal);

          return {
            socioNome: row[socioKey || ''] || '',
            cnpj: row[cnpjKey || ''] || '',
            empresaNome: row[razaoKey || ''] || '',
            telefone: row[telefoneKey || ''] || '',
            previdenciario: parseValue(row[previdenciarioKey || '']),
            simplesNacional: parseValue(row[simplesKey || '']),
            demaisDebitos: parseValue(row[demaisDebitosKey || '']),
            valorTotal: parseValue(row[valorTotalKey || '']),
          };
        })
      );
    };

    reader.readAsBinaryString(file);
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleClearList = () => {
    if (window.confirm('Tem certeza que deseja limpar a lista de contatos?')) {
      setContacts([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Importar Contatos</h2>
          </div>
          
          {contacts.length > 0 && (
            <button
              onClick={handleClearList}
              className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 transition-colors"
              title="Limpar Lista"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Lista
            </button>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Selecionar Planilha
        </button>
        
        <p className="text-sm text-gray-500">
          Formato esperado: planilha Excel (.xlsx/.xls) com colunas para CNPJ, Razão Social, Telefone, Sócio, Previdenciário, Simples Nacional, Demais Débitos e Valor Total
        </p>
      </div>
    </div>
  );
}