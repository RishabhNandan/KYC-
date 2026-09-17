'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileSpreadsheet, Search, Eye, Download, Printer, FileCheck } from 'lucide-react';
import { LetterheadView } from '@/components/LetterheadView';

export default function PdfDocumentsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [hospitalSettings, setHospitalSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Preview Modal
  const [previewRecord, setPreviewRecord] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/recommendations').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ])
      .then(([recData, settsData]) => {
        setRecommendations(recData.recommendations || []);
        setHospitalSettings(settsData.settings);
      })
      .catch((err) => console.error('Error loading PDF documents:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = recommendations.filter(
    (r) =>
      r.recordId.toLowerCase().includes(search.toLowerCase()) ||
      r.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      r.patient.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Generated PDF Documents Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access, preview, print, and download generated official letterhead PDF documents
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search generated PDF by Record ID, Patient Name, or Doctor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            Loading generated PDF documents...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-teal-900 text-sm">{rec.recordId}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded border border-emerald-200">
                    PDF Ready
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{rec.patient.name}</h3>
                  <p className="text-xs text-slate-500">
                    Patient ID: <strong className="text-slate-700 font-mono">{rec.patient.patientId}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-0.5">
                  <p>
                    <strong>Doctor:</strong> {rec.doctor.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Date: {new Date(rec.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewRecord(rec)}
                  className="flex-1 py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <Link
                  href={`/recommendations/${rec.id}`}
                  className="flex-1 py-1.5 px-3 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open & Download</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No generated PDF documents found.
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Document Preview &bull; {previewRecord.recordId}
                </h3>
              </div>
              <button
                onClick={() => setPreviewRecord(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <div className="scale-95 origin-top">
              <LetterheadView hospitalSettings={hospitalSettings} record={previewRecord} />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPreviewRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Close Preview
              </button>
              <Link
                href={`/recommendations/${previewRecord.id}`}
                className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase rounded-lg shadow-sm"
              >
                Open Full View & Download
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
