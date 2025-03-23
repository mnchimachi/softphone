import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CallHistory } from './components/CallHistory';
import { SipConfig } from './components/SipConfig';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

function App() {
  const { user, setUser } = useStore();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setUser(null);
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error in session check:', error);
        setUser(null);
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="historico" element={<CallHistory />} />
          <Route path="configuracao" element={<SipConfig />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;