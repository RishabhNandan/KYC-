'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserPortal from '@/components/kyc/UserPortal';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function Home() {
  const [currentView, setCurrentView] = useState<'USER' | 'ADMIN'>('USER');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar currentView={currentView} onViewChange={(view) => setCurrentView(view)} />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'USER' ? <UserPortal /> : <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
