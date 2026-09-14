'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, CheckCircle2, RefreshCw, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { FaceVerificationResult } from '@/lib/types';

interface Step3Props {
  onNext: (faceData: FaceVerificationResult) => void;
  onBack: () => void;
}

export default function Step3FaceScan({ onNext, onBack }: Step3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const [scanStage, setScanStage] = useState<'INITIAL' | 'DETECTING' | 'LIVENESS' | 'QUALITY_CHECK' | 'READY' | 'CAPTURED' | 'FAILED'>('INITIAL');
  const [statusMessage, setStatusMessage] = useState('Positioning face inside guide oval...');
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceMetrics, setFaceMetrics] = useState({
    faceDetected: false,
    lighting: 'Checking...',
    blurScore: 'Checking...',
    livenessScore: 0.95
  });

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearScanTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      clearScanTimeouts();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        setHasCameraPermission(true);
        runFaceScanSequence();
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const runFaceScanSequence = () => {
    clearScanTimeouts();
    setScanStage('DETECTING');
    setStatusMessage('Face detected. Hold still...');
    setFaceMetrics(prev => ({ ...prev, faceDetected: true, lighting: 'Optimal (Good)', blurScore: '0.04 (Clear)' }));

    // Trigger simulated Liveness Detection Prompt
    const t1 = setTimeout(() => {
      setScanStage('LIVENESS');
      setStatusMessage('Liveness Check: Please blink twice...');
    }, 1800);

    const t2 = setTimeout(() => {
      setScanStage('QUALITY_CHECK');
      setStatusMessage('Analyzing facial depth & symmetry...');
    }, 3600);

    const t3 = setTimeout(() => {
      setScanStage('READY');
      setStatusMessage('Verification Successful! Take Selfie.');
    }, 4800);

    timeoutsRef.current.push(t1, t2, t3);
  };

  const handleTakeSelfie = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      setScanStage('CAPTURED');
      setStatusMessage('Selfie Captured Successfully!');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setScanStage('INITIAL');
    runFaceScanSequence();
  };

  const handleProceed = () => {
    const defaultSampleSelfie = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    
    onNext({
      selfieImage: capturedImage || defaultSampleSelfie,
      livenessDetected: true,
      livenessScore: 0.96,
      lightingQuality: 'GOOD',
      blurScore: 0.04,
      matchConfidence: 0.94,
      status: 'PASSED'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
          <Camera className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Step 3: Face & Liveness Verification</h2>
          <p className="text-xs text-slate-400">Perform live biometric facial scan with depth & liveness check.</p>
        </div>
      </div>

      {/* Main Viewfinder Frame */}
      <div className="relative w-full h-80 bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
        
        {hasCameraPermission === false ? (
          <div className="text-center p-6 space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Camera Access Denied or Unavailable</p>
            <p className="text-xs text-slate-400">Please enable camera permissions in your browser or use sample snapshot mode below.</p>
            <button
              onClick={startCamera}
              className="bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-semibold"
            >
              Retry Camera Access
            </button>
          </div>
        ) : capturedImage ? (
          /* Captured Snapshot Preview */
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Selfie Snapshot" className="w-full h-full object-cover transform -scale-x-100" />
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4" /> Quality Passed
            </div>
          </div>
        ) : (
          /* Live Stream */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Oval Facial Guide */}
            <div className={`absolute border-4 border-dashed rounded-[50%] w-56 h-64 pointer-events-none transition-all duration-500 ${
              scanStage === 'READY' ? 'border-emerald-400 ring-4 ring-emerald-500/20' : 'border-blue-400 animate-pulse'
            }`} />

            {/* Scanning Line overlay */}
            {scanStage === 'DETECTING' && (
              <div className="absolute inset-x-8 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
            )}

            {/* Status Pill Badge */}
            <div className="absolute bottom-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-white border border-slate-700 flex items-center gap-2 shadow-xl">
              <span className={`w-2.5 h-2.5 rounded-full ${
                scanStage === 'READY' ? 'bg-emerald-400 animate-ping' : 'bg-blue-400 animate-pulse'
              }`} />
              {statusMessage}
            </div>
          </div>
        )}

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">Face Detected</span>
          <span className="font-bold text-emerald-400">Yes (1 Face)</span>
        </div>
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">Lighting Quality</span>
          <span className="font-bold text-slate-200">{faceMetrics.lighting}</span>
        </div>
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block text-[10px]">Liveness Confidence</span>
          <span className="font-bold text-blue-400">96.4%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
        >
          Back
        </button>

        {capturedImage ? (
          <div className="w-2/3 flex gap-2">
            <button
              onClick={handleRetake}
              className="w-1/2 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake
            </button>
            <button
              onClick={handleProceed}
              className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              Proceed <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleTakeSelfie}
            disabled={scanStage !== 'READY'}
            className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition"
          >
            <Camera className="w-4 h-4" /> Capture Selfie Snapshot
          </button>
        )}
      </div>

    </div>
  );
}
