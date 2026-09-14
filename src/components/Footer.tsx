'use client';

import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
        
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>VeriTrust Security Architecture</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Engineered with privacy-first standards adhering to RBI KYC Guidelines,
            DPDP Act 2023, and ISO/IEC 27001 data protection protocols. All biometric data and document 
            credentials are encrypted at rest and in transit.
          </p>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">Verification Features</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Passive Liveness Detection</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Auto Document Edge Scanner</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Sensitive OCR Masking</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time Audit Log Trail</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">Supported Documents</h4>
          <div className="flex flex-wrap gap-1.5">
            {['Aadhaar Card', 'PAN Card', 'Passport', 'Driving Licence', 'Voter ID'].map(doc => (
              <span key={doc} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px] border border-slate-700">
                {doc}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026Rishabh Nandan. All rights reserved. For demonstration and prototype testing.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> SSL Encrypted</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-blue-400" /> DPDP Compliant</span>
        </div>
      </div>
    </footer>
  );
}
