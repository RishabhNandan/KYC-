'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowRight, Edit3 } from 'lucide-react';
import { DocumentType, OCRResult, UserProfile } from '@/lib/types';
import { maskDocumentNumber } from '@/lib/kycEngine';

interface Step6Props {
  docType: DocumentType;
  userProfile: UserProfile;
  onNext: (ocrData: OCRResult) => void;
  onBack: () => void;
}

export default function Step6OCRPreview({ docType, userProfile, onNext, onBack }: Step6Props) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(15);
  const [showUnmasked, setShowUnmasked] = useState(false);

  const rawDocNumberMap: Record<DocumentType, string> = {
    'Aadhaar': '4829 1049 5892',
    'PAN': 'ABCPE9841K',
    'Passport': 'Z9481082',
    'Driving Licence': 'KA012018009821',
    'Voter ID': 'EPIC9841203',
    'Gov ID': 'GOV-89412049'
  };

  const rawDocNum = rawDocNumberMap[docType] || '4829 1049 5892';

  const [ocrData, setOcrData] = useState<OCRResult>({
    extractedName: userProfile.fullName,
    extractedDob: userProfile.dob,
    maskedDocNumber: maskDocumentNumber(docType, rawDocNum),
    rawDocNumber: rawDocNum,
    extractedAddress: userProfile.address,
    ocrConfidence: 0.96
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsProcessing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOcrData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceed = () => {
    onNext(ocrData);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Step 6: OCR & Field Extraction</h2>
            <p className="text-xs text-slate-400">Automated optical character recognition and field verification.</p>
          </div>
        </div>

        {!isProcessing && (
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Confidence: 96%
          </span>
        )}
      </div>

      {isProcessing ? (
        /* OCR Loader */
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Extracting Text from {docType}...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Applying machine vision algorithms to detect name, date of birth, document serial number, and security holograms.
          </p>
          <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full mx-auto overflow-hidden">
            <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        /* OCR Fields Result Display */
        <div className="space-y-4">
          
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
              <span>Extracted Document Field</span>
              <span>Confirm / Correct Value</span>
            </div>

            {/* Extracted Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <span className="text-xs font-semibold text-slate-400">Full Name:</span>
              <input
                type="text"
                name="extractedName"
                value={ocrData.extractedName}
                onChange={handleChange}
                className="sm:col-span-2 bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Extracted DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <span className="text-xs font-semibold text-slate-400">Date of Birth:</span>
              <input
                type="date"
                name="extractedDob"
                value={ocrData.extractedDob}
                onChange={handleChange}
                className="sm:col-span-2 bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Document Number with Masking */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <span className="text-xs font-semibold text-slate-400">{docType} Number:</span>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={showUnmasked ? ocrData.rawDocNumber : ocrData.maskedDocNumber}
                  className="w-full bg-slate-800 border border-slate-700 text-cyan-300 font-mono rounded-xl py-2 px-3 text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowUnmasked(!showUnmasked)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title="Toggle Masking"
                >
                  {showUnmasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Extracted Address */}
            {ocrData.extractedAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                <span className="text-xs font-semibold text-slate-400 pt-2">Address:</span>
                <textarea
                  name="extractedAddress"
                  rows={2}
                  value={ocrData.extractedAddress}
                  onChange={handleChange}
                  className="sm:col-span-2 bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleProceed}
              className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition"
            >
              Submit to Verification Engine <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
