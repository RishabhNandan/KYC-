'use client';

import React, { useState } from 'react';
import StepProgress from './StepProgress';
import Step1Registration from './Step1Registration';
import Step2Consent from './Step2Consent';
import Step3FaceScan from './Step3FaceScan';
import Step4DocSelect from './Step4DocSelect';
import Step5DocCapture from './Step5DocCapture';
import Step6OCRPreview from './Step6OCRPreview';
import Step7Verification from './Step7Verification';
import Step8Result from './Step8Result';

import { UserProfile, ConsentRecord, FaceVerificationResult, DocumentType, DocumentInfo, OCRResult, VerificationEngineResult, KYCApplication } from '@/lib/types';
import { ShieldCheck, ArrowRight, CheckCircle2, Clock, AlertTriangle, FileText, Lock } from 'lucide-react';

export default function UserPortal() {
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = Dashboard/Landing, 1-8 = Wizard Steps
  const [currentApp, setCurrentApp] = useState<KYCApplication | null>(null);

  // Draft Application Form State
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [consent, setConsent] = useState<ConsentRecord | undefined>();
  const [faceData, setFaceData] = useState<FaceVerificationResult | undefined>();
  const [docType, setDocType] = useState<DocumentType>('Aadhaar');
  const [documentData, setDocumentData] = useState<DocumentInfo | undefined>();
  const [ocrData, setOcrData] = useState<OCRResult | undefined>();

  const startKYC = () => {
    setActiveStep(1);
  };

  const handleStep1 = (profile: UserProfile) => {
    setUserProfile(profile);
    setActiveStep(2);
  };

  const handleStep2 = (consentData: ConsentRecord) => {
    setConsent(consentData);
    setActiveStep(3);
  };

  const handleStep3 = (faceResult: FaceVerificationResult) => {
    setFaceData(faceResult);
    setActiveStep(4);
  };

  const handleStep4 = (selectedDocType: DocumentType) => {
    setDocType(selectedDocType);
    setActiveStep(5);
  };

  const handleStep5 = (docInfo: DocumentInfo) => {
    setDocumentData(docInfo);
    setActiveStep(6);
  };

  const handleStep6 = (extractedOcr: OCRResult) => {
    setOcrData(extractedOcr);
    setActiveStep(7);
  };

  const handleStep7Complete = async (verificationResult: VerificationEngineResult) => {
    const finalApp: KYCApplication = {
      id: `kyc-app-${Date.now()}`,
      referenceId: verificationResult.referenceId,
      userId: userProfile?.id || `usr-${Date.now()}`,
      userProfile: userProfile!,
      docType,
      status: verificationResult.finalStatus,
      consent,
      faceData,
      documentData,
      ocrData,
      verificationResult,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentApp(finalApp);

    // Save to API
    try {
      await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          docType,
          consent,
          faceData,
          documentData,
          ocrData
        })
      });
    } catch (e) {
      console.error('Failed to post to API:', e);
    }

    setActiveStep(8);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Step Progress Bar (when inside wizard) */}
      {activeStep > 0 && (
        <StepProgress currentStep={activeStep} onStepClick={(step) => setActiveStep(step)} />
      )}

      {/* Step 0: Dashboard / Landing View */}
      {activeStep === 0 && (
        <div className="space-y-8">
          
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Instant AI Identity Verification
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Secure & Fast Digital <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  KYC Onboarding
                </span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Complete your identity verification in under 2 minutes using passive liveness facial analysis, automated document edge scan, and masked OCR processing.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={startKYC}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-500/25 flex items-center gap-2 transition"
                >
                  Start KYC Verification <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Existing Application Tracking Card if available */}
          {currentApp && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Active KYC Application</span>
                  <span className="text-base font-bold text-white font-mono">{currentApp.referenceId}</span>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  currentApp.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  currentApp.status === 'MANUAL_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {currentApp.status === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {currentApp.status === 'MANUAL_REVIEW' && <Clock className="w-3.5 h-3.5" />}
                  {currentApp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Applicant</span>
                  <span className="font-semibold text-slate-200">{currentApp.userProfile.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Document</span>
                  <span className="font-semibold text-blue-400">{currentApp.docType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Submitted</span>
                  <span className="font-semibold text-slate-300">{new Date(currentApp.submittedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setActiveStep(8)}
                    className="text-xs font-bold text-cyan-400 hover:underline"
                  >
                    View Status →
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Wizard Step Renderers */}
      {activeStep === 1 && <Step1Registration initialData={userProfile} onNext={handleStep1} />}
      {activeStep === 2 && <Step2Consent onNext={handleStep2} onBack={() => setActiveStep(1)} />}
      {activeStep === 3 && <Step3FaceScan onNext={handleStep3} onBack={() => setActiveStep(2)} />}
      {activeStep === 4 && <Step4DocSelect selectedType={docType} onNext={handleStep4} onBack={() => setActiveStep(3)} />}
      {activeStep === 5 && <Step5DocCapture docType={docType} onNext={handleStep5} onBack={() => setActiveStep(4)} />}
      {activeStep === 6 && <Step6OCRPreview docType={docType} userProfile={userProfile!} onNext={handleStep6} onBack={() => setActiveStep(5)} />}
      {activeStep === 7 && (
        <Step7Verification
          userProfile={userProfile!}
          docType={docType}
          ocrData={ocrData}
          faceData={faceData}
          documentData={documentData}
          onComplete={handleStep7Complete}
        />
      )}
      {activeStep === 8 && currentApp && (
        <Step8Result
          application={currentApp}
          onReset={() => setActiveStep(1)}
          onGoToDashboard={() => setActiveStep(0)}
        />
      )}

    </div>
  );
}
