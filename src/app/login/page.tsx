'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'coadmin') => {
    if (role === 'admin') {
      setEmail('admin@shantineuroclinic.com');
      setPassword('Admin@123');
    } else {
      setEmail('coadmin@shantineuroclinic.com');
      setPassword('Coadmin@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-8 text-center text-white relative">
          <div className="inline-flex p-3 bg-teal-600/30 backdrop-blur-md rounded-2xl mb-3 border border-teal-500/30">
            <BrainCircuit className="w-10 h-10 text-teal-300" />
          </div>
          <h1 className="text-2xl font-black tracking-wide uppercase font-sans">
            SHANTI NEURO CLINIC
          </h1>
          <p className="text-xs text-teal-300 font-medium mt-1 tracking-wider uppercase">
            Clinical Recommendation & Management System
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-slate-800">Authorized Personnel Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access the clinic dashboard
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@shantineuroclinic.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Quick Demo One-Click Sign In
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 text-left transition-colors"
              >
                <span className="block font-bold">Super Admin</span>
                <span className="text-[10px] text-amber-600 block">admin@shantineuroclinic.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('coadmin')}
                className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 text-left transition-colors"
              >
                <span className="block font-bold">Desk Co-Admin</span>
                <span className="text-[10px] text-teal-600 block">coadmin@shantineuroclinic.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Legal Note */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[10px] text-slate-500">
          Shanti Neuro Clinic &bull; Restricted Authorized Access Only
        </div>
      </div>
    </div>
  );
}
