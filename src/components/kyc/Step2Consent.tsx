'use client';

import React, { useState } from 'react';
import { ShieldAlert, FileText, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConsentRecord } from '@/lib/types';

interface Step2Props {
  onNext: (consent: ConsentRecord) => void;
  onBack: () => void;
}

export default function Step2Consent({ onNext, onBack }: Step2Props) {
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [biometricAgreed, setBiometricAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed || !privacyAgreed || !biometricAgreed) {
      alert('You must explicitly agree to all required consent declarations to proceed with biometric KYC.');
      return;
    }

    onNext({
      termsAgreed,
      privacyAgreed,
      biometricAgreed,
      ipAddress: '103.24.12.89',
      agreedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Step 2: Consent & Privacy Policy</h2>
          <p className="text-xs text-slate-400">Explicit biometric consent and DPDP Act 2023 compliance agreement.</p>
        </div>
      </div>

      {/* Policy Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-3 h-48 overflow-y-auto custom-scrollbar">
        <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-sm">
          <Lock className="w-4 h-4 text-emerald-400" /> Data Privacy & Biometric Processing Notice
        </h4>
        <p>
          By proceeding with this AI-assisted identity verification, you authorize VeriTrust Systems and its authorized verification nodes to capture, process, and perform facial comparison and optical character recognition (OCR) on your submitted identity documents.
        </p>
        <p>
          <strong>1. Purpose of Data Collection:</strong> Information collected (Full Name, Date of Birth, Facial Biometrics, Government ID metadata) will strictly be utilized to verify identity, satisfy anti-money laundering (AML) / Know Your Customer (KYC) regulatory mandates, and prevent fraudulent identity duplication.
        </p>
        <p>
          <strong>2. Encryption & Protection:</strong> All biometric feature vectors and document images are encrypted using 256-bit AES encryption during transit and storage. Access is strictly audited under role-based authorization rules.
        </p>
        <p>
          <strong>3. Retention & Deletion Policy:</strong> Biometric facial templates and raw document captures are automatically purged after 30 days of verification processing or upon user deletion request in compliance with local privacy frameworks.
        </p>
      </div>

      {/* Explicit Checkboxes */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition">
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-200 block mb-0.5">Terms & Conditions Agreement</span>
            <span className="text-slate-400">I have read, understood, and accept the general Terms of Service for digital KYC identity processing.</span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-200 block mb-0.5">Privacy Policy Consent</span>
            <span className="text-slate-400">I consent to the collection and handling of my identity data as specified under applicable privacy guidelines.</span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition">
          <input
            type="checkbox"
            checked={biometricAgreed}
            onChange={(e) => setBiometricAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-200 block mb-0.5">Biometric Facial Scan & Liveness Consent</span>
            <span className="text-slate-400">I explicitly authorize camera facial feature vector analysis and liveness depth checks for 1-to-1 face matching.</span>
          </div>
        </label>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!termsAgreed || !privacyAgreed || !biometricAgreed}
            className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition"
          >
            Accept & Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
