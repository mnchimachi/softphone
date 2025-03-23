import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, CallLog, SipConfig, SipStatus } from '../types/Contact';
import { User } from '@supabase/supabase-js';

interface State {
  contacts: Contact[];
  currentContact: Contact | null;
  callLogs: CallLog[];
  sipConfig: SipConfig | null;
  sipStatus: SipStatus;
  user: User | null;
  setContacts: (contacts: Contact[]) => void;
  setCurrentContact: (contact: Contact | null) => void;
  addCallLog: (log: CallLog) => void;
  setSipConfig: (config: SipConfig) => void;
  setSipStatus: (status: SipStatus) => void;
  setUser: (user: User | null) => void;
  removeContact: (contact: Contact) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      contacts: [],
      currentContact: null,
      callLogs: [],
      sipConfig: null,
      sipStatus: { connected: false },
      user: null,
      setContacts: (contacts) => set({ contacts }),
      setCurrentContact: (contact) => set({ currentContact: contact }),
      addCallLog: (log) => set((state) => ({ callLogs: [...state.callLogs, log] })),
      setSipConfig: (config) => set({ sipConfig: config }),
      setSipStatus: (status) => set({ sipStatus: status }),
      setUser: (user) => set({ user }),
      removeContact: (contact) => set((state) => ({
        contacts: state.contacts.filter(c => 
          c.cnpj !== contact.cnpj || 
          c.telefone !== contact.telefone
        ),
        currentContact: null
      })),
    }),
    {
      name: 'softphone-storage',
      partialize: (state) => ({
        sipConfig: state.sipConfig,
        callLogs: state.callLogs,
      }),
    }
  )
);