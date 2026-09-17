'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Filter,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  regNumber: string;
  department: string;
  designation: string;
  email?: string | null;
  phone?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    department: 'Neurology',
    designation: 'Senior Consultant Neurologist',
    email: '',
    phone: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);
      if (departmentFilter) query.append('department', departmentFilter);

      const res = await fetch(`/api/doctors?${query.toString()}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, statusFilter, departmentFilter]);

  const openAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      regNumber: '',
      department: 'Neurology',
      designation: 'Senior Consultant Neurologist',
      email: '',
      phone: '',
      status: 'ACTIVE',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      regNumber: doc.regNumber,
      department: doc.department,
      designation: doc.designation,
      email: doc.email || '',
      phone: doc.phone || '',
      status: doc.status,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (doc: Doctor) => {
    const newStatus = doc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/doctors/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDoctors();
      }
    } catch (err) {
      console.error('Status toggle failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const url = editingDoctor ? `/api/doctors/${editingDoctor.id}` : '/api/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save doctor details');
      }

      setIsModalOpen(false);
      fetchDoctors();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain specialist roster, medical registration numbers, and status for Shanti Neuro Clinic
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name, reg number, department, or designation..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">All Departments</option>
            <option value="Neurology">Neurology</option>
            <option value="Neurosurgery">Neurosurgery</option>
            <option value="Neuro-Rehabilitation">Neuro-Rehabilitation</option>
            <option value="Interventional Neurology">Interventional Neurology</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading doctors list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Reg Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.length > 0 ? (
                  doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{doc.name}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-teal-800">{doc.regNumber}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{doc.department}</td>
                      <td className="py-3.5 px-4 text-slate-600">{doc.designation}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{doc.phone || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">{doc.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            doc.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {doc.status === 'ACTIVE' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{doc.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(doc)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(doc)}
                          className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                            doc.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {doc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No doctors matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingDoctor ? 'Edit Doctor Record' : 'Add New Doctor Specialist'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. S. K. Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Medical Reg Number *</label>
                <input
                  type="text"
                  required
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  placeholder="e.g. MC-987654"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="Neurology">Neurology</option>
                    <option value="Neurosurgery">Neurosurgery</option>
                    <option value="Neuro-Rehabilitation">Neuro-Rehabilitation</option>
                    <option value="Interventional Neurology">Interventional Neurology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation / Qualification *</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Senior Consultant Neurologist (MD, DM Neurology)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dr@shantineuroclinic.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold uppercase rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
