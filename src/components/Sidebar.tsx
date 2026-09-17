'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FileText,
  PlusCircle,
  History,
  FileSpreadsheet,
  ShieldCheck,
  Activity,
  Settings,
  BrainCircuit,
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'SUPER_ADMIN' | 'CO_ADMIN';
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();

  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const navItemClass = (path: string, exact = false) => {
    const active = exact ? pathname === path : pathname.startsWith(path);
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-teal-800 text-white shadow-sm'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 flex-shrink-0">
      {/* Brand Logo & Name */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-teal-600 p-2 rounded-lg text-white shadow-md flex items-center justify-center">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wide text-white font-sans leading-tight">
            SHANTI NEURO
          </h1>
          <p className="text-[11px] text-teal-400 font-medium tracking-wider uppercase">
            Clinical Doc System
          </p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Current Role:</span>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
            isSuperAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
          }`}
        >
          {isSuperAdmin ? 'Super Admin' : 'Co-Admin'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Main Menu
          </p>
          <div className="space-y-1">
            <Link href="/dashboard" className={navItemClass('/dashboard', true)}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/doctors" className={navItemClass('/doctors')}>
              <UserCheck className="w-4 h-4" />
              <span>Doctors</span>
            </Link>
            <Link href="/patients" className={navItemClass('/patients')}>
              <Users className="w-4 h-4" />
              <span>Patients</span>
            </Link>
          </div>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Recommendations
          </p>
          <div className="space-y-1">
            <Link href="/recommendations/new" className={navItemClass('/recommendations/new', true)}>
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>New Entry</span>
            </Link>
            <Link href="/recommendations" className={navItemClass('/recommendations', true)}>
              <History className="w-4 h-4" />
              <span>Recommendation History</span>
            </Link>
            <Link href="/pdf-documents" className={navItemClass('/pdf-documents')}>
              <FileSpreadsheet className="w-4 h-4" />
              <span>PDF Documents</span>
            </Link>
          </div>
        </div>

        {isSuperAdmin && (
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Administration
            </p>
            <div className="space-y-1">
              <Link href="/users" className={navItemClass('/users')}>
                <ShieldCheck className="w-4 h-4" />
                <span>Users / Co-Admins</span>
              </Link>
              <Link href="/audit-logs" className={navItemClass('/audit-logs')}>
                <Activity className="w-4 h-4" />
                <span>Audit Logs</span>
              </Link>
              <Link href="/settings" className={navItemClass('/settings')}>
                <Settings className="w-4 h-4" />
                <span>Hospital Settings</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 font-sans">
        <p className="font-semibold text-slate-300">SHANTI NEURO CLINIC</p>
        <p className="mt-0.5 text-slate-400">Ver 2.5 &bull; Manual Documentation System</p>
      </div>
    </aside>
  );
};
