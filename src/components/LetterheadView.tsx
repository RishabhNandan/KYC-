'use client';

import React from 'react';

export interface LetterheadProps {
  hospitalSettings?: {
    hospitalName?: string;
    tagline?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    licenseNo?: string;
    logoUrl?: string;
    disclaimerText?: string;
  };
  record: {
    recordId: string;
    date: string | Date;
    diagnosis: string;
    recommendation: string;
    followUp?: string | null;
    additionalInstructions?: string | null;
    remarks?: string | null;
    authorizedPerson: string;
    signatureData?: string | null;
    doctor: {
      name: string;
      regNumber: string;
      department: string;
      designation: string;
    };
    patient: {
      name: string;
      patientId: string;
      age: number;
      gender: string;
      phone?: string | null;
      address?: string | null;
    };
  };
}

export const LetterheadView: React.FC<LetterheadProps> = ({ hospitalSettings, record }) => {
  const hospital = {
    name: hospitalSettings?.hospitalName || 'SHANTI NEURO CLINIC',
    tagline: hospitalSettings?.tagline || 'Advanced Neurological Care & Rehabilitation Center',
    address: hospitalSettings?.address || '102 Neuro Care Tower, Health Avenue, Medical District, City - 400001',
    phone: hospitalSettings?.phone || '+91 98765 43210 / +91 022 2847 9900',
    email: hospitalSettings?.email || 'contact@shantineuroclinic.com',
    website: hospitalSettings?.website || 'www.shantineuroclinic.com',
    licenseNo: hospitalSettings?.licenseNo || 'HOSP-NC-2026-8899',
    disclaimer:
      hospitalSettings?.disclaimerText ||
      "This official recommendation document is generated based solely on authorized medical personnel's manually entered clinical observations and instructions at Shanti Neuro Clinic.",
  };

  const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="letterhead-document"
      className="bg-white text-slate-900 mx-auto border border-slate-300 shadow-xl rounded-sm p-8 sm:p-12 w-full max-w-[800px] min-h-[1050px] flex flex-col justify-between print:border-none print:shadow-none print:p-6 print:m-0 print:w-full print:max-w-none"
      style={{ fontFamily: 'Georgia, serif, system-ui' }}
    >
      <div>
        {/* Hospital Official Header */}
        <div className="border-b-2 border-teal-800 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-wide text-teal-900 font-sans uppercase">
                {hospital.name}
              </h1>
              <p className="text-sm font-semibold text-teal-700 font-sans tracking-wide mt-0.5">
                {hospital.tagline}
              </p>
              <p className="text-xs text-slate-600 font-sans mt-1.5 max-w-lg leading-relaxed">
                {hospital.address}
              </p>
              <div className="text-xs text-slate-600 font-sans mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>Tel:</strong> {hospital.phone}
                </span>
                <span>
                  <strong>Email:</strong> {hospital.email}
                </span>
                <span>
                  <strong>Web:</strong> {hospital.website}
                </span>
              </div>
            </div>

            <div className="text-right sm:text-right flex flex-col items-end">
              <div className="bg-teal-900 text-white text-[11px] font-sans font-bold px-3 py-1 rounded tracking-wider uppercase mb-1">
                Medical Recommendation
              </div>
              <span className="text-xs font-sans text-slate-500">License No: {hospital.licenseNo}</span>
              <div className="mt-2 text-right">
                <span className="block text-xs font-sans text-slate-500 uppercase tracking-wider">Record ID</span>
                <span className="font-mono text-sm font-bold text-teal-950">{record.recordId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor & Date Header Meta */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 text-xs font-medium uppercase block">Attending Doctor</span>
              <strong className="text-slate-900 text-base font-semibold block">{record.doctor.name}</strong>
              <span className="text-slate-600 text-xs block">{record.doctor.designation}</span>
              <span className="text-teal-800 text-xs font-medium block">Dept: {record.doctor.department}</span>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div className="mb-2">
                <span className="text-slate-500 text-xs font-medium uppercase block">Reg Number</span>
                <strong className="text-slate-800 font-mono text-sm">{record.doctor.regNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-medium uppercase block">Document Date</span>
                <strong className="text-slate-800 text-sm">{formattedDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details Block */}
        <div className="border border-teal-200 bg-teal-50/40 rounded-lg p-4 mb-6 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 mb-3">
            Patient Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-[11px] uppercase">Patient Name</span>
              <strong className="text-slate-900 font-semibold">{record.patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase">Patient ID</span>
              <strong className="font-mono text-slate-900">{record.patient.patientId}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase">Age / Gender</span>
              <span className="text-slate-900 font-medium">
                {record.patient.age} Yrs / {record.patient.gender}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] uppercase">Contact Phone</span>
              <span className="text-slate-900">{record.patient.phone || 'N/A'}</span>
            </div>
          </div>
          {record.patient.address && (
            <div className="mt-2.5 pt-2 border-t border-teal-100/60 text-xs text-slate-700">
              <span className="text-slate-500 font-medium mr-1">Address:</span> {record.patient.address}
            </div>
          )}
        </div>

        {/* Clinical Notes Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-teal-950 bg-slate-100 px-3 py-1.5 rounded border-l-4 border-teal-700 mb-2">
            Clinical Notes / Diagnosis
          </h3>
          <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed px-2 font-serif">
            {record.diagnosis}
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-teal-950 bg-slate-100 px-3 py-1.5 rounded border-l-4 border-teal-700 mb-2">
            Recommendation
          </h3>
          <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed px-2 font-serif font-medium">
            {record.recommendation}
          </div>
        </div>

        {/* Follow-up Section */}
        {record.followUp && (
          <div className="mb-6">
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-teal-950 bg-slate-100 px-3 py-1.5 rounded border-l-4 border-teal-700 mb-2">
              Follow-Up
            </h3>
            <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed px-2 font-serif">
              {record.followUp}
            </div>
          </div>
        )}

        {/* Additional Instructions */}
        {record.additionalInstructions && (
          <div className="mb-6">
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-teal-950 bg-slate-100 px-3 py-1.5 rounded border-l-4 border-teal-700 mb-2">
              Additional Instructions
            </h3>
            <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed px-2 font-serif">
              {record.additionalInstructions}
            </div>
          </div>
        )}

        {/* Remarks */}
        {record.remarks && (
          <div className="mb-6">
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-800 bg-slate-50 px-3 py-1.5 rounded mb-2">
              Remarks
            </h3>
            <div className="text-xs text-slate-700 italic whitespace-pre-wrap leading-relaxed px-2">
              {record.remarks}
            </div>
          </div>
        )}
      </div>

      {/* Footer Authorization & Signature Block */}
      <div className="pt-6 border-t border-slate-300 font-sans mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-4">
          <div className="text-xs text-slate-600 max-w-xs">
            <p className="font-semibold text-slate-800 mb-0.5">Shanti Neuro Clinic Verification</p>
            <p className="text-[11px] leading-tight text-slate-500">{hospital.disclaimer}</p>
          </div>

          <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
            {record.signatureData ? (
              <div className="mb-1 border-b border-slate-400 pb-1">
                {record.signatureData.startsWith('data:image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={record.signatureData}
                    alt="Signature"
                    className="h-14 max-w-[200px] object-contain"
                  />
                ) : (
                  <span className="font-serif italic text-lg text-slate-900 px-4 py-1 block">
                    {record.signatureData}
                  </span>
                )}
              </div>
            ) : (
              <div className="h-12 w-48 border-b border-dashed border-slate-400 mb-1"></div>
            )}
            <div className="text-right">
              <span className="block text-xs font-bold text-slate-900">{record.authorizedPerson}</span>
              <span className="block text-[11px] text-slate-500 uppercase tracking-wider">Authorized Signatory</span>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-sans uppercase tracking-widest">
          {hospital.name} &bull; OFFICIAL CLINICAL DOCUMENTATION SYSTEM &bull; {record.recordId}
        </div>
      </div>
    </div>
  );
};
