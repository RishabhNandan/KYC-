'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { LetterheadView } from '@/components/LetterheadView';
import {
  Printer,
  Download,
  ArrowLeft,
  Eye,
  FileCheck,
  CheckCircle,
  Share2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function SingleRecommendationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [record, setRecord] = useState<any>(null);
  const [hospitalSettings, setHospitalSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/recommendations/${resolvedParams.id}`).then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ])
      .then(([recData, settsData]) => {
        if (recData.recommendation) {
          setRecord(recData.recommendation);
        }
        if (settsData.settings) {
          setHospitalSettings(settsData.settings);
        }
      })
      .catch((err) => console.error('Error fetching recommendation record:', err))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById('letterhead-document');
    if (!el) return;

    try {
      setGeneratingPdf(true);
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`${record.recordId}_${record.patient.name.replace(/\s+/g, '_')}.pdf`);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Fallback to Print button.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs font-semibold">
        Loading recommendation record...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Recommendation Record Not Found</h2>
        <button
          onClick={() => router.push('/recommendations')}
          className="px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-lg"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => router.push('/recommendations')}
            className="text-xs font-semibold text-slate-500 hover:text-teal-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to History
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-mono">
              {record.recordId}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
              Official Document
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Patient: <strong className="text-slate-800">{record.patient.name}</strong> ({record.patient.patientId}) &bull; Attending: <strong className="text-slate-800">{record.doctor.name}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pdfSuccess && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-4 h-4" /> PDF Saved!
            </span>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{generatingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Official Letterhead Printable View */}
      <div className="bg-slate-200/60 p-4 sm:p-8 rounded-2xl border border-slate-300 print:bg-white print:p-0 print:border-none">
        <LetterheadView hospitalSettings={hospitalSettings} record={record} />
      </div>
    </div>
  );
}
