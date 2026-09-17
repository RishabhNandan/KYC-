'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  Trash2,
  Edit,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

export default function RecommendationHistoryPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (doctorId) query.append('doctorId', doctorId);
      if (date) query.append('date', date);

      const [recRes, docRes, userRes] = await Promise.all([
        fetch(`/api/recommendations?${query.toString()}`).then((r) => r.json()),
        fetch('/api/doctors').then((r) => r.json()),
        fetch('/api/auth/me').then((r) => r.json()),
      ]);

      setRecommendations(recRes.recommendations || []);
      setDoctors(docRes.doctors || []);
      setCurrentUser(userRes.user);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, doctorId, date]);

  const handleDelete = async (id: string, recordId: string) => {
    if (!confirm(`Are you sure you want to delete Recommendation Record ${recordId}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/recommendations/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete record');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recommendation History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, view, print, and download official hospital letterhead recommendations
          </p>
        </div>

        <Link
          href="/recommendations/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Recommendation</span>
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Record ID (REC-2026-XXXXXX), Patient Name, Doctor, or Clinical diagnosis..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          />

          {(search || doctorId || date) && (
            <button
              onClick={() => {
                setSearch('');
                setDoctorId('');
                setDate('');
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading recommendation history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Patient ID / Name</th>
                  <th className="py-3 px-4">Created By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-900">{rec.recordId}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {new Date(rec.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {rec.doctor.name}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {rec.doctor.department}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        <strong className="block">{rec.patient.name}</strong>
                        <span className="font-mono text-[11px] text-teal-800 font-medium">
                          {rec.patient.patientId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {rec.authorizedPerson || rec.createdBy.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <Link
                          href={`/recommendations/${rec.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </Link>

                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(rec.id, rec.recordId)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Record (Super Admin)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No recommendation records match the filters.
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
