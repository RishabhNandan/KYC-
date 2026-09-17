'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, ShieldCheck, User } from 'lucide-react';

interface AuditLog {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (actionFilter) query.append('action', actionFilter);

      const res = await fetch(`/api/audit-logs?${query.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Audit Trail & Security Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin security log recording all logins, doctor updates, recommendation creations, and document print actions
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by user name, action, details, or entity..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="">All Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
          <option value="DOCTOR_CREATED">DOCTOR_CREATED</option>
          <option value="DOCTOR_UPDATED">DOCTOR_UPDATED</option>
          <option value="RECOMMENDATION_CREATED">RECOMMENDATION_CREATED</option>
          <option value="RECOMMENDATION_EDITED">RECOMMENDATION_EDITED</option>
          <option value="RECOMMENDATION_DELETED">RECOMMENDATION_DELETED</option>
          <option value="SETTINGS_UPDATED">SETTINGS_UPDATED</option>
          <option value="USER_CREATED">USER_CREATED</option>
        </select>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading security audit log...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{log.userName || 'System'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.userRole === 'SUPER_ADMIN'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-900">{log.action}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{log.entity}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-sm">{log.details}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No audit records found matching query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
