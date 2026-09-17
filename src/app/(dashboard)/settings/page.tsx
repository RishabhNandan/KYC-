'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Building2, Save, ShieldAlert, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    hospitalName: 'SHANTI NEURO CLINIC',
    tagline: 'Advanced Neurological Care & Rehabilitation Center',
    address: '102 Neuro Care Tower, Health Avenue, Medical District, City - 400001',
    phone: '+91 98765 43210 / +91 022 2847 9900',
    email: 'contact@shantineuroclinic.com',
    website: 'www.shantineuroclinic.com',
    licenseNo: 'HOSP-NC-2026-8899',
    disclaimerText:
      "This official recommendation document is generated based solely on authorized medical personnel's manually entered clinical observations and instructions at Shanti Neuro Clinic.",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setFormData({
            hospitalName: data.settings.hospitalName || 'SHANTI NEURO CLINIC',
            tagline: data.settings.tagline || '',
            address: data.settings.address || '',
            phone: data.settings.phone || '',
            email: data.settings.email || '',
            website: data.settings.website || '',
            licenseNo: data.settings.licenseNo || '',
            disclaimerText: data.settings.disclaimerText || '',
          });
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update hospital settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs font-semibold">
        Loading hospital configuration settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure hospital letterhead branding, official address, contacts, and legal disclaimers
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Hospital letterhead settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hospital Branding */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Hospital Letterhead Header Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hospital Name *
              </label>
              <input
                type="text"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Medical License Number
              </label>
              <input
                type="text"
                value={formData.licenseNo}
                onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tagline / Sub-header
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Official Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Telephone Contact
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
            Official Letterhead Footer Disclaimer
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Legal Verification Statement
            </label>
            <textarea
              rows={3}
              value={formData.disclaimerText}
              onChange={(e) => setFormData({ ...formData, disclaimerText: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed font-sans"
            ></textarea>
            <p className="text-[11px] text-slate-400 mt-1">
              This statement appears at the bottom of every generated official letterhead PDF document.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Settings...' : 'Save Hospital Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
