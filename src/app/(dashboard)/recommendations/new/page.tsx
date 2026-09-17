'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LetterheadView } from '@/components/LetterheadView';
import { SignaturePad } from '@/components/SignaturePad';
import {
  FileText,
  UserCheck,
  User,
  CheckCircle,
  Eye,
  Save,
  Printer,
  ShieldAlert,
  ArrowLeft,
  Plus,
} from 'lucide-react';

export default function NewRecommendationPage() {
  const router = useRouter();

  // Master Data
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [hospitalSettings, setHospitalSettings] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [patientMode, setPatientMode] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  // New Patient Fields
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: '45',
    gender: 'Male',
    phone: '',
    address: '',
  });

  // Clinical Fields (Pure Manual Entry)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [remarks, setRemarks] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  const [signatureData, setSignatureData] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState<'FORM' | 'PREVIEW'>('FORM');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/doctors?status=ACTIVE').then((r) => r.json()),
      fetch('/api/patients').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ])
      .then(([docData, patData, settsData, meData]) => {
        setDoctors(docData.doctors || []);
        if (docData.doctors && docData.doctors.length > 0) {
          setSelectedDoctorId(docData.doctors[0].id);
        }

        setPatients(patData.patients || []);
        if (patData.patients && patData.patients.length > 0) {
          setSelectedPatientId(patData.patients[0].id);
        }

        setHospitalSettings(settsData.settings);

        if (meData.user) {
          setAuthorizedPerson(meData.user.name);
        }
      })
      .catch((err) => console.error('Error initializing form data:', err))
      .finally(() => setLoadingData(false));
  }, []);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || {
    name: 'Dr. Select Doctor',
    regNumber: 'MC-XXXXXX',
    department: 'Neurology',
    designation: 'Consultant Neurologist',
  };

  const selectedPatient =
    patientMode === 'EXISTING'
      ? patients.find((p) => p.id === selectedPatientId) || {
          name: 'Patient Name',
          patientId: 'PAT-2026-XXXXX',
          age: 45,
          gender: 'Male',
        }
      : {
          name: newPatientData.name || 'New Patient',
          patientId: 'PAT-2026-NEW',
          age: parseInt(newPatientData.age || '0', 10),
          gender: newPatientData.gender,
          phone: newPatientData.phone,
          address: newPatientData.address,
        };

  const liveRecord = {
    recordId: 'REC-2026-PREVIEW',
    date: date || new Date(),
    diagnosis: diagnosis || '[Manually entered clinical notes/diagnosis will appear here]',
    recommendation: recommendation || '[Manually entered recommendation details will appear here]',
    followUp: followUp || null,
    additionalInstructions: additionalInstructions || null,
    remarks: remarks || null,
    authorizedPerson: authorizedPerson || 'Authorized Signatory',
    signatureData: signatureData || null,
    doctor: selectedDoctor,
    patient: selectedPatient,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (!selectedDoctorId) {
      setFormError('Please select an attending doctor');
      setSubmitting(false);
      return;
    }

    if (!diagnosis || !recommendation) {
      setFormError('Clinical Notes / Diagnosis and Recommendation text are mandatory.');
      setSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        doctorId: selectedDoctorId,
        date,
        diagnosis,
        recommendation,
        followUp,
        additionalInstructions,
        remarks,
        authorizedPerson,
        signatureData,
      };

      if (patientMode === 'EXISTING') {
        payload.patientId = selectedPatientId;
      } else {
        payload.newPatient = {
          name: newPatientData.name,
          age: parseInt(newPatientData.age, 10),
          gender: newPatientData.gender,
          phone: newPatientData.phone,
          address: newPatientData.address,
        };
      }

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save recommendation record');
      }

      // Redirect to generated record view
      router.push(`/recommendations/${data.recommendation.id}`);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs font-semibold">
        Loading recommendation entry form...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <button
            onClick={() => router.back()}
            className="text-xs font-semibold text-slate-500 hover:text-teal-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Recommendation Record
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manually record official clinical notes and instructions on Shanti Neuro Clinic letterhead
          </p>
        </div>

        {/* Tab switcher for mobile / narrow screens */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('FORM')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'FORM' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entry Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'PREVIEW' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-teal-700" />
            <span>Live Letterhead Preview</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="font-semibold">{formError}</span>
        </div>
      )}

      {/* Main Grid: Left Form (lg:col-span-6) / Right Live Preview (lg:col-span-6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            activeTab === 'PREVIEW' ? 'hidden lg:block' : 'block'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Doctor Selection */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4 text-teal-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Doctor Information
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Doctor Specialist *
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} &bull; {d.regNumber} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100 text-xs space-y-0.5">
                  <p className="font-bold text-teal-950">{selectedDoctor.name}</p>
                  <p className="text-slate-600">Reg No: {selectedDoctor.regNumber}</p>
                  <p className="text-teal-800 font-medium">{selectedDoctor.designation}</p>
                </div>
              )}
            </div>

            {/* 2. Patient Information */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-700" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Patient Details
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPatientMode('EXISTING')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      patientMode === 'EXISTING'
                        ? 'bg-teal-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Select Registered
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('NEW')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      patientMode === 'NEW'
                        ? 'bg-teal-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    + Register New
                  </button>
                </div>
              </div>

              {patientMode === 'EXISTING' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Select Patient *
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientId}) &bull; {p.age} Yrs / {p.gender}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPatientData.name}
                      onChange={(e) =>
                        setNewPatientData({ ...newPatientData, name: e.target.value })
                      }
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Age (Yrs) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newPatientData.age}
                        onChange={(e) =>
                          setNewPatientData({ ...newPatientData, age: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Gender *
                      </label>
                      <select
                        value={newPatientData.gender}
                        onChange={(e) =>
                          setNewPatientData({ ...newPatientData, gender: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newPatientData.phone}
                      onChange={(e) =>
                        setNewPatientData({ ...newPatientData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Document Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* 3. Clinical & Recommendation Text Entry (Manual Entry Only) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-teal-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Clinical & Recommendation Notes (Manual Entry Only)
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Diagnosis / Clinical Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter manual clinical observation, symptoms, or diagnostic findings..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 leading-relaxed font-sans"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Recommendation *
                </label>
                <textarea
                  rows={4}
                  required
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  placeholder="Enter manual recommendations, lifestyle advice, therapy directions, or medical guidance..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 leading-relaxed font-sans font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Follow-Up Details
                </label>
                <textarea
                  rows={2}
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="e.g. Follow up in 2 weeks or review with repeat MRI..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Additional Instructions
                </label>
                <textarea
                  rows={2}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Ergonomic posture guidelines, activity restrictions..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="General administrative or patient status remarks..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            {/* 4. Authorization & Digital Signature */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Created / Authorized By (Name) *
                </label>
                <input
                  type="text"
                  required
                  value={authorizedPerson}
                  onChange={(e) => setAuthorizedPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <SignaturePad
                value={signatureData}
                onChange={(sig) => setSignatureData(sig)}
                authorizedPersonName={authorizedPerson}
              />
            </div>

            {/* Save / Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Saving Record & Generating PDF...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Recommendation & Generate Letterhead PDF</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview Column (lg:col-span-6) */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            activeTab === 'FORM' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-slate-800 text-white px-4 py-3 rounded-xl flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Live Letterhead Preview
              </span>
            </div>
            <span className="text-[11px] text-slate-300 bg-slate-700 px-2 py-0.5 rounded">
              A4 Format
            </span>
          </div>

          <div className="scale-95 origin-top transform-gpu">
            <LetterheadView hospitalSettings={hospitalSettings} record={liveRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
