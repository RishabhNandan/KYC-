'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  FileText,
  Calendar,
  FileCheck,
  PlusCircle,
  ArrowRight,
  Activity,
  History,
  Eye,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<{
    stats: {
      totalDoctors: number;
      totalRecommendations: number;
      todayEntries: number;
      totalPdfs: number;
    };
    recentRecords: any[];
    recentActivities: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-700 border-t-transparent"></div>
        <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Dashboard Metrics...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalDoctors: 0,
    totalRecommendations: 0,
    todayEntries: 0,
    totalPdfs: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800/60 rounded-full text-xs font-medium text-teal-300 mb-3 border border-teal-700/50">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            SHANTI NEURO CLINIC SYSTEM ACTIVE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Clinical Recommendation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Welcome to the official documentation portal. Search doctors, manually create recommendation records, preview live letterheads, and print official PDFs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recommendations/new"
            className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Recommendation</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Doctors</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalDoctors}</h3>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl text-teal-700">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Active Specialists</span>
            <Link href="/doctors" className="text-teal-700 font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalRecommendations}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Historical Catalog</span>
            <Link href="/recommendations" className="text-blue-700 font-semibold hover:underline">
              View History &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Entries</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.todayEntries}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Recorded Today</span>
            <span className="text-amber-700 font-semibold">Active Session</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated PDFs</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalPdfs}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Official Documents</span>
            <Link href="/pdf-documents" className="text-emerald-700 font-semibold hover:underline">
              PDF Library &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Records & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Records (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Recommendation Records</h2>
              <p className="text-xs text-slate-500">Latest entries recorded on hospital letterhead</p>
            </div>
            <Link
              href="/recommendations"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Record ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Doctor</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentRecords && data.recentRecords.length > 0 ? (
                  data.recentRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-900">{rec.recordId}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {new Date(rec.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{rec.doctor.name}</td>
                      <td className="py-3 px-3 text-slate-700">
                        {rec.patient.name}{' '}
                        <span className="font-mono text-[11px] text-slate-400">({rec.patient.patientId})</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/recommendations/${rec.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No recommendation records created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log Feed (1 Col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Audit Activity</h2>
              <p className="text-xs text-slate-500">Real-time system action log</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {data?.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{act.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-snug">{act.details}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>By: {act.userName}</span>
                    <span className="uppercase font-semibold">{act.userRole}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs">No audit activity logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
