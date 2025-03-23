import React from 'react';
import { ContactList } from '../components/ContactList';
import { CallInterface } from '../components/CallInterface';
import { ExcelImport } from '../components/ExcelImport';

export function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-6">
        <ExcelImport />
      </div>
      
      <div className="md:col-span-2 space-y-6">
        <CallInterface />
        <ContactList />
      </div>
    </div>
  );
}