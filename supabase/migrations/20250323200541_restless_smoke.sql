/*
  # Initial Schema Setup for Softphone

  1. New Tables
    - `users` - Stores user information
      - `id` (uuid, primary key) - User ID from auth.users
      - `email` (text) - User email
      - `created_at` (timestamp) - Account creation date
    
    - `call_logs` - Stores call history
      - `id` (uuid, primary key) - Call log ID
      - `user_id` (uuid) - Reference to users table
      - `telefone` (text) - Phone number called
      - `duracao` (integer) - Call duration in seconds
      - `status` (text) - Call status (sucesso, falha, nao-atendida)
      - `timestamp` (timestamp) - When the call occurred
      - `socio_nome` (text) - Contact name
      - `cnpj` (text) - Company CNPJ
      - `empresa_nome` (text) - Company name
      - `notas` (text) - Call notes
      - `created_at` (timestamp) - Record creation date

    - `sip_configs` - Stores SIP configuration
      - `id` (uuid, primary key) - Config ID
      - `user_id` (uuid) - Reference to users table
      - `nome_conta` (text) - Account name
      - `usuario` (text) - SIP username
      - `login` (text) - SIP login
      - `senha` (text) - SIP password
      - `servidor` (text) - SIP server
      - `proxy_sip` (text) - SIP proxy
      - `dominio` (text) - SIP domain
      - `created_at` (timestamp) - Record creation date
      - `updated_at` (timestamp) - Last update date

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create their own records
      - Update their own records
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create call_logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  telefone text NOT NULL,
  duracao integer NOT NULL,
  status text NOT NULL CHECK (status IN ('sucesso', 'falha', 'nao-atendida')),
  timestamp timestamptz NOT NULL,
  socio_nome text NOT NULL,
  cnpj text NOT NULL,
  empresa_nome text NOT NULL,
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Create sip_configs table
CREATE TABLE IF NOT EXISTS sip_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  nome_conta text NOT NULL,
  usuario text NOT NULL,
  login text NOT NULL,
  senha text NOT NULL,
  servidor text NOT NULL,
  proxy_sip text NOT NULL,
  dominio text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sip_configs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Call logs policies
CREATE POLICY "Users can read own call logs"
  ON call_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own call logs"
  ON call_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- SIP configs policies
CREATE POLICY "Users can read own SIP config"
  ON sip_configs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own SIP config"
  ON sip_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SIP config"
  ON sip_configs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();