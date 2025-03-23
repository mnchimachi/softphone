export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      call_logs: {
        Row: {
          id: string
          user_id: string
          telefone: string
          duracao: number
          status: 'sucesso' | 'falha' | 'nao-atendida'
          timestamp: string
          socio_nome: string
          cnpj: string
          empresa_nome: string
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          telefone: string
          duracao: number
          status: 'sucesso' | 'falha' | 'nao-atendida'
          timestamp: string
          socio_nome: string
          cnpj: string
          empresa_nome: string
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          telefone?: string
          duracao?: number
          status?: 'sucesso' | 'falha' | 'nao-atendida'
          timestamp?: string
          socio_nome?: string
          cnpj?: string
          empresa_nome?: string
          notas?: string | null
          created_at?: string
        }
      }
      sip_configs: {
        Row: {
          id: string
          user_id: string
          nome_conta: string
          usuario: string
          login: string
          senha: string
          servidor: string
          proxy_sip: string
          dominio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome_conta: string
          usuario: string
          login: string
          senha: string
          servidor: string
          proxy_sip: string
          dominio: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome_conta?: string
          usuario?: string
          login?: string
          senha?: string
          servidor?: string
          proxy_sip?: string
          dominio?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}