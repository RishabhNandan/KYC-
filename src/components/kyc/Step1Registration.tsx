'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface Step1Props {
  initialData?: UserProfile;
  onNext: (profile: UserProfile) => void;
}

export default function Step1Registration({ initialData, onNext }: Step1Props) {
  const [formData, setFormData] = useState<UserProfile>(
    initialData || {
      id: `usr-${Date.now()}`,
      fullName: 'Vikramaditya Sharma',
      email: 'vikram.sharma@example.com',
      mobile: '+91 98765 43210',
      dob: '1995-08-14',
      address: '402, Green Valley Apartments, Bandra West, Mumbai, Maharashtra 400050',
      gender: 'Male',
      role: 'USER'
    }
  );

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'mobile') {
      setIsOtpVerified(false);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.dob) {
      alert('Please fill in all mandatory personal details.');
      return;
    }
    setShowOtpModal(true);
  };

  const handleVerifyOtp = () => {
    const entered = otpCode.join('');
    if (entered === '123456') {
      setIsOtpVerified(true);
      setShowOtpModal(false);
    } else {
      setOtpError('Invalid OTP code. Please enter 123456 for demo verification.');
    }
  };

  const handleSubmitFinal = () => {
    onNext(formData);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Step 1: User Registration</h2>
          <p className="text-xs text-slate-400">Enter your official identity details as recorded on government documents.</p>
        </div>
      </div>

      <form onSubmit={handleStartOtp} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Vikramaditya Sharma"
              className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email & Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* DOB & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth *</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Gender (Optional)</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Residential Address *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <textarea
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Flat No, Building, Street, City, State, Pincode"
              className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* OTP Status Badge */}
        <div className="pt-2">
          {isOtpVerified ? (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-emerald-400 text-xs font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mobile & Email Verified via OTP (123456)
              </span>
              <button
                type="button"
                onClick={handleSubmitFinal}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                Proceed to Step 2 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-5 h-5" /> Verify OTP & Continue
            </button>
          )}
        </div>

      </form>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enter OTP Code</h3>
              <p className="text-xs text-slate-400">
                A 6-digit verification code was sent to <span className="text-blue-300 font-semibold">{formData.mobile}</span> and <span className="text-blue-300 font-semibold">{formData.email}</span>.
              </p>
              <span className="inline-block bg-blue-500/10 text-blue-400 text-[11px] px-2.5 py-1 rounded-full font-mono border border-blue-500/20">
                Demo OTP Code: 123456
              </span>
            </div>

            {/* 6 Digit Input */}
            <div className="flex justify-between gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otpCode];
                    newOtp[idx] = e.target.value;
                    setOtpCode(newOtp);
                  }}
                  className="w-10 h-12 text-center text-lg font-bold bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-rose-400 text-center font-medium">{otpError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20"
              >
                Verify & Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
