'use client';

import React from 'react';
import { Check, User, ShieldAlert, Camera, FileText, Scan, Cpu, CheckCircle2 } from 'lucide-react';

interface StepProgressProps {
  currentStep: number; // 1 to 8
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { number: 1, title: 'Registration', icon: User },
  { number: 2, title: 'Consent', icon: ShieldAlert },
  { number: 3, title: 'Face Scan', icon: Camera },
  { number: 4, title: 'Document', icon: FileText },
  { number: 5, title: 'Scan/Upload', icon: Scan },
  { number: 6, title: 'OCR Extraction', icon: Cpu },
  { number: 7, title: 'Verification', icon: Cpu },
  { number: 8, title: 'KYC Result', icon: CheckCircle2 }
];

export default function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl mb-8">
      {/* Desktop/Tablet Horizontal Steps */}
      <div className="hidden md:flex items-center justify-between relative">
        
        {/* Connecting Line Background */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-800 rounded -z-0" />
        
        {/* Active Progress Fill Line */}
        <div
          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded transition-all duration-500 -z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%` }}
        />

        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              onClick={() => isCompleted && onStepClick?.(step.number)}
              className={`flex flex-col items-center relative z-10 ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-slate-900'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110 shadow-lg shadow-blue-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>

              <span
                className={`text-[11px] font-medium mt-2 transition-colors ${
                  isCurrent
                    ? 'text-blue-400 font-bold'
                    : isCompleted
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}

      </div>

      {/* Mobile Condensed View */}
      <div className="md:hidden flex items-center justify-between bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {currentStep}
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Step {currentStep} of {STEPS.length}</span>
            <span className="text-sm font-semibold text-white">{STEPS[currentStep - 1]?.title}</span>
          </div>
        </div>
        
        <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
