'use client';

import React, { useState } from 'react';
import { FileText, CreditCard, Shield, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DocumentType } from '@/lib/types';

interface Step4Props {
  selectedType?: DocumentType;
  onNext: (docType: DocumentType) => void;
  onBack: () => void;
}

const DOCUMENTS: { type: DocumentType; title: string; desc: string; requiresBack: boolean }[] = [
  { type: 'Aadhaar', title: 'Aadhaar Card', desc: '12-digit Unique Identification Authority of India (UIDAI) ID card.', requiresBack: true },
  { type: 'PAN', title: 'PAN Card', desc: 'Permanent Account Number issued by Income Tax Department.', requiresBack: false },
  { type: 'Passport', title: 'Indian Passport', desc: 'Official Republic of India international travel booklet.', requiresBack: true },
  { type: 'Driving Licence', title: 'Driving Licence', desc: 'State Regional Transport Office (RTO) driving credential.', requiresBack: true },
  { type: 'Voter ID', title: 'Voter ID (EPIC)', desc: 'Election Commission of India Photo Identity Card.', requiresBack: true },
  { type: 'Gov ID', title: 'Other Gov ID', desc: 'Official state or central government photo identity document.', requiresBack: false }
];

export default function Step4DocSelect({ selectedType = 'Aadhaar', onNext, onBack }: Step4Props) {
  const [docType, setDocType] = useState<DocumentType>(selectedType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(docType);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Step 4: Select Identity Document</h2>
          <p className="text-xs text-slate-400">Choose the government-issued photo identity document you wish to upload.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Document Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {DOCUMENTS.map((doc) => {
            const isSelected = docType === doc.type;
            return (
              <div
                key={doc.type}
                onClick={() => setDocType(doc.type)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">{doc.title}</h3>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{doc.desc}</p>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-700/50">
                  <span className="text-slate-500">Requires Back Side:</span>
                  <span className={`font-semibold ${doc.requiresBack ? 'text-amber-400' : 'text-slate-400'}`}>
                    {doc.requiresBack ? 'Front + Back' : 'Front Only'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3 text-xs text-slate-400">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p>
            <strong>Regulatory Note:</strong> Document verification processes and supported types comply with applicable central and state laws. VeriTrust matches details directly against official databases where authorized.
          </p>
        </div>

        {/* Actions */}
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
            className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition"
          >
            Proceed to Document Capture <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
