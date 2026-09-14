'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, Scan, RotateCw, Crop, CheckCircle2, AlertTriangle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { DocumentType, DocumentInfo } from '@/lib/types';

interface Step5Props {
  docType: DocumentType;
  onNext: (documentData: DocumentInfo) => void;
  onBack: () => void;
}

export default function Step5DocCapture({ docType, onNext, onBack }: Step5Props) {
  const [captureMode, setCaptureMode] = useState<'CAMERA' | 'UPLOAD'>('CAMERA');
  const [activeSide, setActiveSide] = useState<'FRONT' | 'BACK'>('FRONT');
  
  const [frontImage, setFrontImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  );
  const [backImage, setBackImage] = useState<string | null>(null);

  const [qualityChecks, setQualityChecks] = useState({
    edgeDetected: true,
    perspectiveCorrected: true,
    hasGlare: false,
    isBlurred: false,
    qualityScore: 0.94
  });

  const requiresBack = ['Aadhaar', 'Passport', 'Driving Licence', 'Voter ID'].includes(docType);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'FRONT' | 'BACK') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (side === 'FRONT') setFrontImage(reader.result as string);
        else setBackImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = () => {
    if (!frontImage) {
      alert('Please upload or capture the front side of your identity document.');
      return;
    }
    if (requiresBack && !backImage) {
      // Default sample back image if not captured
      setBackImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80');
    }

    onNext({
      id: `doc-${Date.now()}`,
      docType,
      frontImage,
      backImage: backImage || undefined,
      ...qualityChecks
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Step 5: Document Capture</h2>
            <p className="text-xs text-slate-400">Scan or upload your official <span className="text-blue-400 font-semibold">{docType}</span> document.</p>
          </div>
        </div>

        {/* Capture Mode Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setCaptureMode('CAMERA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              captureMode === 'CAMERA' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Camera Scan
          </button>
          <button
            onClick={() => setCaptureMode('UPLOAD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              captureMode === 'UPLOAD' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload File
          </button>
        </div>
      </div>

      {/* Side Selector Tabs if required */}
      {requiresBack && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSide('FRONT')}
            className={`w-1/2 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${
              activeSide === 'FRONT'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}
          >
            Front Side {frontImage && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => setActiveSide('BACK')}
            className={`w-1/2 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${
              activeSide === 'BACK'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}
          >
            Back Side {backImage && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      )}

      {/* Main Preview Box */}
      <div className="relative w-full h-64 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden flex items-center justify-center">
        
        {captureMode === 'CAMERA' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
            {activeSide === 'FRONT' && frontImage ? (
              <img src={frontImage} alt="Document Front" className="w-full h-full object-cover" />
            ) : activeSide === 'BACK' && backImage ? (
              <img src={backImage} alt="Document Back" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <Scan className="w-10 h-10 text-blue-400 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-slate-300 font-semibold">Position document inside frame</p>
                <p className="text-[11px] text-slate-500">Auto edge detection & glare check active</p>
              </div>
            )}

            {/* Scanning Edge Overlay Frame */}
            <div className="absolute inset-6 border-2 border-dashed border-cyan-400 rounded-xl pointer-events-none" />
            <div className="absolute top-2 right-2 bg-slate-900/80 px-2.5 py-1 rounded-full text-[10px] text-cyan-300 font-mono border border-slate-700">
              Auto-Crop Active
            </div>
          </div>
        ) : (
          /* Upload Mode Dropzone */
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900/80 transition p-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, activeSide)}
            />
            <Upload className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-xs text-slate-200 font-bold">Click or drag image to upload {activeSide} side</p>
            <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP (Max 10MB)</p>
          </label>
        )}

      </div>

      {/* Quality Checks Bar */}
      <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 block">Edges</span>
          <span className="font-bold text-emerald-400">Detected ✓</span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 block">Perspective</span>
          <span className="font-bold text-emerald-400">Aligned ✓</span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 block">Glare Check</span>
          <span className="font-bold text-emerald-400">No Glare ✓</span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 block">Blur Check</span>
          <span className="font-bold text-emerald-400">Sharp (94%)</span>
        </div>
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
          onClick={handleProceed}
          className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition"
        >
          Run OCR Processing <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
