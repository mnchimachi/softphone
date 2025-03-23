export interface Contact {
  socioNome: string;
  cnpj: string;
  empresaNome: string;
  telefone: string;
  previdenciario: number;
  simplesNacional: number;
  demaisDebitos: number;
  valorTotal: number;
  notas: string;
}

export interface CallLog {
  telefone: string;
  duracao: number;
  status: 'sucesso' | 'falha' | 'nao-atendida';
  timestamp: Date;
  socioNome: string;
  cnpj: string;
  empresaNome: string;
  notas: string;
}

export interface SipConfig {
  nomeConta: string;
  usuario: string;
  login: string;
  senha: string;
  servidor: string;
  proxySip: string;
  dominio: string;
}

export interface SipStatus {
  connected: boolean;
  error?: string;
}