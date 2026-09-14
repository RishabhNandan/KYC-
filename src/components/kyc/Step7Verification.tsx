'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Sparkles } from 'lucide-react';
import { UserProfile, DocumentType, OCRResult, FaceVerificationResult, DocumentInfo, VerificationEngineResult } from '@/lib/types';
import { evaluateKYC } from '@/lib/kycEngine';

interface Step7Props {
  userProfile: UserProfile;
  docType: DocumentType;
  ocrData?: OCRResult;
  faceData?: FaceVerificationResult;
  documentData?: DocumentInfo;
  onComplete: (result: VerificationEngineResult) => void;
}

export default function Step7Verification({
  userProfile,
  docType,
  ocrData,
  faceData,
  documentData,
  onComplete
}: Step7Props) {
  const [completedChecks, setCompletedChecks] = useState<number[]>([]);
  const [result, setResult] = useState<VerificationEngineResult | null>(null);

  const CHECKS = [
    { id: 1, title: 'Name & DOB Profile Match', desc: 'Comparing registered details with extracted document OCR' },
    { id: 2, title: 'Facial Biometric 1:1 Match', desc: 'Comparing live selfie feature vector with document portrait photo' },
    { id: 3, title: 'Passive Liveness & Quality', desc: 'Verifying 3D spatial depth and light glare factors' },
    { id: 4, title: 'Duplicate Identity Detection', desc: 'Searching database for previous registrations or fraud flags' }
  ];

  useEffect(() => {
    // Run evaluation engine computation
    const evaluation = evaluateKYC(userProfile, docType, ocrData, faceData, documentData);
    setResult(evaluation);

    const timers: NodeJS.Timeout[] = [];

    // Sequence checklist animations
    CHECKS.forEach((check, index) => {
      const t = setTimeout(() => {
        setCompletedChecks(prev => [...prev, check.id]);
      }, (index + 1) * 800);
      timers.push(t);
    });

    // Auto-advance after all checks complete
    const finalTimer = setTimeout(() => {
      onComplete(evaluation);
    }, CHECKS.length * 800 + 1000);
    timers.push(finalTimer);

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl mx-auto text-center space-y-6">
      
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 mx-auto shadow-xl shadow-blue-500/30">
        <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">Step 7: Verification & Matching Engine</h2>
        <p className="text-xs text-slate-400 mt-1">Cross-referencing biometrics, document metadata, and profile data.</p>
      </div>

      {/* Verification Checklist */}
      <div className="space-y-3 text-left">
        {CHECKS.map((check) => {
          const isDone = completedChecks.includes(check.id);
          return (
            <div
              key={check.id}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                isDone
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-slate-200">{check.title}</h4>
                <p className="text-[11px] text-slate-400">{check.desc}</p>
              </div>

              <div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-scale" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 italic">
        * VeriTrust AI Matching Engine is executing 1-to-1 feature comparison. Please do not close or refresh this tab.
      </p>

    </div>
  );
}
