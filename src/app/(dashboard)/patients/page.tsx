'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Phone, MapPin, Calendar, FileText } from 'lucide-react';

interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/patients?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register patient');
      }

      setIsModalOpen(false);
      setFormData({ name: '', age: '', gender: 'Male', phone: '', address: '' });
      fetchPatients();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered patient records & unique Patient IDs for Shanti Neuro Clinic
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient by name, Patient ID (PAT-2026-XXXXX), or phone number..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Patients List Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading patient registry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length > 0 ? (
                  patients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-900">{pat.patientId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{pat.name}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {pat.age} Yrs / {pat.gender}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{pat.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {pat.address || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(pat.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No registered patients matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Register New Patient</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Patient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 45"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Patient residential address..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase rounded-lg shadow-sm"
                >
                  {submitting ? 'Registering...' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
