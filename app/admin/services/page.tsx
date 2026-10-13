'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { ServiceItem, PricingModel, ServiceCategory } from '@/lib/types';

export default function AdminServicesConfigPage() {
  const {
    services,
    addService,
    updateService,
    deleteService,
    toggleServicePublish,
    isHydrated,
  } = useVairaStore();

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState<Partial<ServiceItem>>({});

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading service configuration portal...
      </div>
    );
  }

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setIsCreatingNew(false);
    setFormData({ ...service });
  };

  const handleCreateClick = () => {
    setIsCreatingNew(true);
    setEditingService(null);
    setFormData({
      slug: 'new-service-slug',
      name: 'New Home Care Service',
      category: 'nursing',
      shortDescription: 'Brief description of service for cards and search...',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
      whoThisIsFor: ['Patients recovering at home'],
      whatIncluded: ['Basic vitals documentation', 'Bedside hygiene'],
      whatNotIncluded: ['Emergency resuscitation', 'Medicines supply'],
      availabilityHours: '12h Shift or 24h Stay-in',
      availableDays: 'Monday to Sunday',
      serviceAreas: ['Kanchipuram', 'Vembedu'],
      minimumDuration: '3 Days',
      pricingModel: 'per_shift_12h',
      basePrice: 1000,
      additionalChargesNotice: 'Standard service area applies.',
      requiredInformation: ['Physician discharge summary'],
      faqs: [{ question: 'How do shifts work?', answer: 'Coordinated as day or night shifts.' }],
      cancellationPolicy: '24-hour advance notice required.',
      termsNotice: 'Subject to staff verification.',
      seoTitle: 'Home Care Service | Vaira Home Care',
      seoDescription: 'Professional home healthcare in Kanchipuram and Vembedu.',
      isPublished: true,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    if (isCreatingNew) {
      addService(formData as any);
      alert('New service successfully added to catalog!');
    } else if (editingService) {
      updateService(editingService.id, formData);
      alert('Service settings updated! Changes reflect live on website.');
    }

    setEditingService(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Operations
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-bold text-emerald-700">Service Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Service Catalog & Pricing Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure service scopes, transparent pricing models, inclusions, exclusions, and visibility without any code changes.
          </p>
        </div>

        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table List (Section 16) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Catalog Services ({services.length})
          </span>
          <span className="text-xs text-slate-400">
            {services.filter((s) => s.isPublished).length} Active Online
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Service Name & Slug</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Pricing Model & Rate</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Areas</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Status Toggle */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleServicePublish(srv.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition-colors ${
                        srv.isPublished
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Click to toggle publish"
                    >
                      {srv.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{srv.isPublished ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  {/* Name & Slug */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 text-sm">{srv.name}</div>
                    <div className="text-slate-400 font-mono text-[11px]">/services/{srv.slug}</div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 whitespace-nowrap capitalize font-medium text-slate-700">
                    {srv.category}
                  </td>

                  {/* Pricing */}
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-emerald-700">
                    {srv.basePrice > 0 ? `₹${srv.basePrice.toLocaleString()}` : 'Custom'}
                    <span className="text-[10px] text-slate-400 font-normal block">
                      {srv.pricingModel.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Availability */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {srv.availabilityHours}
                  </td>

                  {/* Areas */}
                  <td className="px-4 py-3 max-w-xs truncate text-slate-500">
                    {srv.serviceAreas.join(', ')}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                    <Link
                      href={`/services/${srv.slug}`}
                      target="_blank"
                      className="inline-block p-1.5 text-slate-400 hover:text-emerald-700"
                      title="Preview Customer Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditClick(srv)}
                      className="inline-block p-1.5 text-slate-600 hover:text-blue-600"
                      title="Edit Service Configuration"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / CREATE SERVICE CONFIGURATION MODAL (Section 16) */}
      {(editingService || isCreatingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {isCreatingNew ? 'Create New Service' : `Configure Service: ${editingService?.name}`}
                </h3>
                <p className="text-xs text-slate-500">All fields are editable by the admin team.</p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsCreatingNew(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              {/* Pricing Model & Base Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pricing Model</label>
                  <select
                    value={formData.pricingModel || 'per_shift_12h'}
                    onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
                  >
                    <option value="per_shift_12h">12-Hour Shift</option>
                    <option value="per_shift_24h">24-Hour Shift</option>
                    <option value="hourly">Hourly / Visit</option>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly Package</option>
                    <option value="custom">Custom Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={formData.basePrice || 0}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Minimum Duration</label>
                  <input
                    type="text"
                    value={formData.minimumDuration || ''}
                    onChange={(e) => setFormData({ ...formData, minimumDuration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Inclusions (newline separated) */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  What Service May Include (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.whatIncluded?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatIncluded: e.target.value.split('\n').filter((l) => l.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              {/* Exclusions (newline separated) */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  What Is NOT Included (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.whatNotIncluded?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatNotIncluded: e.target.value.split('\n').filter((l) => l.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              {/* Additional charges & cancellation policy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Additional Charges Disclaimer
                  </label>
                  <input
                    type="text"
                    value={formData.additionalChargesNotice || ''}
                    onChange={(e) => setFormData({ ...formData, additionalChargesNotice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Cancellation Policy</label>
                  <input
                    type="text"
                    value={formData.cancellationPolicy || ''}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubToggle"
                  checked={formData.isPublished ?? true}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="pubToggle" className="font-bold text-slate-800 text-xs cursor-pointer">
                  Publish to Customer Discovery Catalog (Active online)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
