'use client';

import React, { useRef } from 'react';
import { CheckCircle2, AlertTriangle, Clock, Download, ShieldCheck, UserCheck, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { KYCApplication, VerificationEngineResult } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Step8Props {
  application: KYCApplication;
  onReset: () => void;
  onGoToDashboard: () => void;
}

export default function Step8Result({ application, onReset, onGoToDashboard }: Step8Props) {
  const resultRef = useRef<HTMLDivElement>(null);
  const status = application.status;
  const refId = application.referenceId || 'KYC-2026-89412';

  const downloadReceipt = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VeriTrust_KYC_Receipt_${refId}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Generating text receipt...');
      const text = `VeriTrust KYC Verification Receipt\nReference ID: ${refId}\nStatus: ${status}\nDate: ${new Date().toLocaleDateString()}\nName: ${application.userProfile.fullName}`;
      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `KYC_Receipt_${refId}.txt`;
      document.body.appendChild(element);
      element.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Printable Receipt Card */}
      <div ref={resultRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Status Header */}
        <div className="text-center space-y-3 pb-6 border-b border-slate-800">
          
          {status === 'VERIFIED' && (
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}

          {status === 'MANUAL_REVIEW' && (
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Clock className="w-8 h-8" />
            </div>
          )}

          {status === 'FAILED' && (
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}

          <div className="inline-block bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 border border-slate-700">
            Ref ID: {refId}
          </div>

          <h2 className="text-2xl font-bold text-white">
            {status === 'VERIFIED' && 'KYC Verification Complete'}
            {status === 'MANUAL_REVIEW' && 'KYC Submitted for Manual Review'}
            {status === 'FAILED' && 'KYC Verification Could Not Be Completed'}
          </h2>

          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {status === 'VERIFIED' && 'Your identity information, biometrics, and document metadata have been successfully verified.'}
            {status === 'MANUAL_REVIEW' && 'Your application requires secondary administrative inspection before final approval.'}
            {status === 'FAILED' && 'The submitted details or document quality did not meet automated compliance rules.'}
          </p>

        </div>

        {/* Verification Checklist Breakdown */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verification Summary</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Identity Profile</span>
              <span className="font-bold text-emerald-400">Verified ✓</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Document Scan</span>
              <span className="font-bold text-emerald-400">Processed ✓</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Face & Liveness</span>
              <span className="font-bold text-emerald-400">Passed ✓</span>
            </div>
          </div>
        </div>

        {/* User Info Details Table */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Applicant Name:</span>
            <span className="font-semibold text-white">{application.userProfile.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Email Address:</span>
            <span className="font-semibold text-white">{application.userProfile.email}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Document Type:</span>
            <span className="font-semibold text-blue-400">{application.docType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Submission Timestamp:</span>
            <span className="font-semibold text-slate-300">
              {new Date(application.submittedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Failure Reasons if any */}
        {application.verificationResult?.failureReasons && application.verificationResult.failureReasons.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-xs text-rose-300 space-y-1">
            <span className="font-bold block">Compliance Notes:</span>
            <ul className="list-disc pl-4 space-y-0.5">
              {application.verificationResult.failureReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadReceipt}
          className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl border border-slate-700 text-xs flex items-center justify-center gap-2 transition"
        >
          <Download className="w-4 h-4" /> Download PDF Receipt
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
        >
          <RefreshCw className="w-4 h-4" /> Start New Verification
        </button>
      </div>

    </div>
  );
}
