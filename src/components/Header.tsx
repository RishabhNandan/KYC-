'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, PlusCircle, Building2, Bell } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'CO_ADMIN';
  } | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Building2 className="w-5 h-5 text-teal-700" />
          <h2 className="font-bold text-lg text-slate-900 tracking-tight font-sans">
            SHANTI NEURO CLINIC
          </h2>
          <span className="hidden md:inline-block text-xs bg-teal-50 text-teal-800 font-medium px-2.5 py-0.5 rounded-full border border-teal-200/80">
            Official Documentation System
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Add Recommendation Action */}
        <Link
          href="/recommendations/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Recommendation</span>
        </Link>

        {/* User Info & Menu */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {user.name}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {user.role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Desk Co-Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign Out"
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{loggingOut ? 'Signing Out...' : 'Logout'}</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};
