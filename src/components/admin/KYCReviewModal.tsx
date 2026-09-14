'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, RefreshCw, Eye, EyeOff, ShieldAlert, FileText, User, Camera, Lock } from 'lucide-react';
import { KYCApplication, KYCStatus } from '@/lib/types';

interface ReviewModalProps {
  application: KYCApplication;
  onClose: () => void;
  onAdminAction: (appId: string, action: string, newStatus: KYCStatus, notes: string) => void;
}

export default function KYCReviewModal({ application, onClose, onAdminAction }: ReviewModalProps) {
  const [showUnmasked, setShowUnmasked] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<KYCStatus | 'RESUBMIT'>('VERIFIED');

  const handleExecuteAction = (status: KYCStatus, actionName: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide compulsory review notes/reason for this administrative action.');
      return;
    }
    onAdminAction(application.id, actionName, status, adminNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              {application.referenceId}
            </span>
            <h2 className="text-lg font-bold text-white">KYC Application Review</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* User Profile Section */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Applicant Personal Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block">Full Name</span>
                <span className="font-bold text-white text-sm">{application.userProfile.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <span className="font-semibold text-slate-200">{application.userProfile.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mobile Number</span>
                <span className="font-semibold text-slate-200">{application.userProfile.mobile}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date of Birth</span>
                <span className="font-semibold text-slate-200">{application.userProfile.dob}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Address</span>
                <span className="font-semibold text-slate-200">{application.userProfile.address}</span>
              </div>
            </div>
          </div>

          {/* Biometrics & Face Scan Breakdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" /> Facial Biometrics & Liveness Analysis
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              {/* Selfie Image */}
              <div className="w-24 h-28 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shrink-0 mx-auto sm:mx-0">
                <img
                  src={application.faceData?.selfieImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt="Applicant Selfie"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-3 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Liveness Score</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {Math.round((application.faceData?.livenessScore || 0.95) * 100)}%
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Face Match Confidence</span>
                  <span className="font-bold text-blue-400 text-sm">
                    {application.verificationResult?.faceMatchScore || 94}%
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Lighting Quality</span>
                  <span className="font-semibold text-slate-200">{application.faceData?.lightingQuality || 'GOOD'}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Image Blur Score</span>
                  <span className="font-semibold text-slate-200">0.04 (Clear)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document & Masked OCR Section */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Document OCR & Extracted Data
              </h3>

              {/* Unmask Toggle Button */}
              <button
                onClick={() => setShowUnmasked(!showUnmasked)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 text-[11px]"
              >
                {showUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showUnmasked ? 'Mask Document #' : 'Unmask Document #'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block">Document Type</span>
                <span className="font-bold text-blue-400">{application.docType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Extracted Number</span>
                <span className="font-mono font-bold text-cyan-300">
                  {showUnmasked ? application.ocrData?.rawDocNumber : application.ocrData?.maskedDocNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">OCR Confidence</span>
                <span className="font-bold text-emerald-400">
                  {Math.round((application.ocrData?.ocrConfidence || 0.95) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Notes Box */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-200">Administrative Review Notes *</label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Provide reason for approval, rejection, or resubmission request..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => handleExecuteAction('VERIFIED', 'APPROVE_APPLICATION')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve Application
          </button>
          <button
            onClick={() => handleExecuteAction('FAILED', 'REJECT_APPLICATION')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow"
          >
            <XCircle className="w-4 h-4" /> Reject Application
          </button>
          <button
            onClick={() => handleExecuteAction('MANUAL_REVIEW', 'REQUEST_RESUBMISSION')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-4 h-4" /> Request Resubmission
          </button>
        </div>

      </div>
    </div>
  );
}
