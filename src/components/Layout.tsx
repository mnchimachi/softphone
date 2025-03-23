import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, History, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export function Layout() {
  const location = useLocation();
  const { sipStatus } = useStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 py-2">
                <Phone className={`h-6 w-6 ${sipStatus.connected ? 'text-green-600' : 'text-red-600'}`} />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Softphone VoIP
                </span>
              </Link>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  to="/"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    location.pathname === '/'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Chamadas
                </Link>
                
                <Link
                  to="/historico"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    location.pathname === '/historico'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <History className="h-4 w-4 mr-1" />
                  Histórico
                </Link>

                <Link
                  to="/configuracao"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    location.pathname === '/configuracao'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configuração
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}