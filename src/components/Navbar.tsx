'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Lock, User, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentView: 'USER' | 'ADMIN';
  onViewChange: (view: 'USER' | 'ADMIN') => void;
  isAdminLoggedIn?: boolean;
}

export default function Navbar({ currentView, onViewChange, isAdminLoggedIn }: NavbarProps) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('USER')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
                VeriTrust AI
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                KYC v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Automated Identity & Biometric Verification</p>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onViewChange('USER')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              currentView === 'USER'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden xs:inline">User Portal</span>
          </button>

          <button
            onClick={() => onViewChange('ADMIN')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              currentView === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Portal</span>
            {isAdminLoggedIn && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Security Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit AES</span>
          </div>
        </div>

      </div>
    </header>
  );
}
