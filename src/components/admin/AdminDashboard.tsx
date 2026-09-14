'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, Clock, XCircle, AlertTriangle, Search, Filter,
  ShieldCheck, Lock, Eye, LogOut, ArrowUpDown, Calendar, RefreshCw
} from 'lucide-react';
import { KYCApplication, KYCStatus, AuditLog } from '@/lib/types';
import { INITIAL_KYC_APPLICATIONS, INITIAL_AUDIT_LOGS } from '@/lib/mockData';
import KYCReviewModal from './KYCReviewModal';
import AuditLogsView from './AuditLogsView';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for demo
  const [adminEmail, setAdminEmail] = useState('admin@kyc.com');
  const [adminPassword, setAdminPassword] = useState('Admin@123456');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'APPLICATIONS' | 'AUDIT_LOGS' | 'SETTINGS'>('APPLICATIONS');
  
  const [applications, setApplications] = useState<KYCApplication[]>(INITIAL_KYC_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [selectedApp, setSelectedApp] = useState<KYCApplication | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [docFilter, setDocFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/kyc');
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@kyc.com' && adminPassword === 'Admin@123456') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin@kyc.com / Admin@123456');
    }
  };

  const handleAdminAction = async (appId: string, action: string, newStatus: KYCStatus, notes: string) => {
    // Update local state
    setApplications(prev =>
      prev.map(app =>
        app.id === appId
          ? { ...app, status: newStatus, reviewNotes: notes, reviewedBy: adminEmail }
          : app
      )
    );

    // Call API
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetKycId: selectedApp?.referenceId || appId,
          targetUserName: selectedApp?.userProfile.fullName || 'User',
          adminEmail,
          notes,
          newStatus
        })
      });
      const data = await res.json();
      if (data.auditLog) {
        setAuditLogs(prev => [data.auditLog, ...prev]);
      }
    } catch (err) {
      console.error('Admin action error:', err);
    }
  };

  // Compute Statistics Metrics
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'SUBMITTED').length,
    verified: applications.filter(a => a.status === 'VERIFIED').length,
    manualReview: applications.filter(a => a.status === 'MANUAL_REVIEW').length,
    failed: applications.filter(a => a.status === 'FAILED').length,
    today: applications.filter(a => new Date(a.submittedAt).toDateString() === new Date().toDateString()).length
  };

  // Filtered Applications
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userProfile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userProfile.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesDoc = docFilter === 'ALL' || app.docType === docFilter;

    return matchesSearch && matchesStatus && matchesDoc;
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Admin Portal Login</h2>
            <p className="text-xs text-slate-400">Authorized KYC compliance & review team access.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {loginError && <p className="text-xs text-rose-400 font-medium">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition"
            >
              Authenticate & Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Welcome Rishabh Nandan </h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Admin Session Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Logged in as {adminEmail}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab('APPLICATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'APPLICATIONS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('AUDIT_LOGS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'AUDIT_LOGS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Logs
            </button>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Total KYC Apps</span>
          <span className="text-2xl font-black text-white">{stats.total}</span>
        </div>
        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 block font-medium">Pending Review</span>
          <span className="text-2xl font-black text-amber-300">{stats.manualReview + stats.pending}</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-400 block font-medium">Verified Apps</span>
          <span className="text-2xl font-black text-emerald-300">{stats.verified}</span>
        </div>
        <div className="bg-slate-900 border border-rose-500/20 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-rose-400 block font-medium">Failed Apps</span>
          <span className="text-2xl font-black text-rose-300">{stats.failed}</span>
        </div>
        <div className="bg-slate-900 border border-cyan-500/20 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-cyan-400 block font-medium">Manual Review</span>
          <span className="text-2xl font-black text-cyan-300">{stats.manualReview}</span>
        </div>
        <div className="bg-slate-900 border border-blue-500/20 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-blue-400 block font-medium">Today's Apps</span>
          <span className="text-2xl font-black text-blue-300">{stats.today}</span>
        </div>
      </div>

      {activeTab === 'APPLICATIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          
          {/* Controls Header: Search & Multi-Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Name, Ref ID, Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="MANUAL_REVIEW">Manual Review</option>
                  <option value="FAILED">Failed</option>
                  <option value="SUBMITTED">Submitted</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Doc:</span>
                <select
                  value={docFilter}
                  onChange={(e) => setDocFilter(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none"
                >
                  <option value="ALL">All Documents</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving Licence">Driving Licence</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
              </div>

              <button
                onClick={fetchApplications}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                title="Refresh Table"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4 font-semibold">Ref ID</th>
                  <th className="py-3 px-4 font-semibold">Applicant Name</th>
                  <th className="py-3 px-4 font-semibold">Doc Type</th>
                  <th className="py-3 px-4 font-semibold">Submitted</th>
                  <th className="py-3 px-4 font-semibold">Overall Status</th>
                  <th className="py-3 px-4 font-semibold">Face Liveness</th>
                  <th className="py-3 px-4 font-semibold">OCR Score</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{app.referenceId}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{app.userProfile.fullName}</span>
                      <span className="text-slate-500 text-[11px]">{app.userProfile.email}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-300">{app.docType}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        app.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        app.status === 'MANUAL_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        app.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      {Math.round((app.faceData?.livenessScore || 0.95) * 100)}% Passed
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">
                      {Math.round((app.ocrData?.ocrConfidence || 0.95) * 100)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-xl font-semibold text-[11px] border border-blue-500/30 transition"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab === 'AUDIT_LOGS' && <AuditLogsView auditLogs={auditLogs} />}

      {/* Review Drawer / Modal */}
      {selectedApp && (
        <KYCReviewModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAdminAction={handleAdminAction}
        />
      )}

    </div>
  );
}
