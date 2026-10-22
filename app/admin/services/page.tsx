'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Save,
  X,
  RefreshCw,
  Package,
  DollarSign,
  Clock,
  MapPin,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { ServiceItem, PricingModel } from '@/lib/types';

export default function AdminServicesConfigPage() {
  const {
    services,
    addService,
    updateService,
    toggleServicePublish,
    isHydrated,
  } = useVairaStore();

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceItem>>({});
  const [saved, setSaved] = useState(false);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading service configuration...</span>
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
      shortDescription: 'Brief description for cards and search...',
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
    } else if (editingService) {
      updateService(editingService.id, formData);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditingService(null);
      setIsCreatingNew(false);
    }, 1200);
  };

  const publishedCount = services.filter((s) => s.isPublished).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Service Config</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Catalog &amp; Pricing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure scopes, pricing models, inclusions, and visibility — no code changes needed.
          </p>
        </div>
        <button onClick={handleCreateClick} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Services', value: services.length, icon: <Package className="w-4 h-4 text-slate-600" />, bg: 'bg-slate-100' },
          { label: 'Active Online', value: publishedCount, icon: <Eye className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' },
          { label: 'Drafts', value: services.length - publishedCount, icon: <EyeOff className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
          {
            label: 'Avg. Base Price',
            value: `₹${Math.round(services.reduce((s, srv) => s + srv.basePrice, 0) / Math.max(services.length, 1)).toLocaleString('en-IN')}`,
            icon: <DollarSign className="w-4 h-4 text-teal-600" />,
            bg: 'bg-teal-50',
          },
        ].map((card, i) => (
          <div key={i} className="kpi-card animate-slide-up">
            <div className={`w-8 h-8 ${card.bg} rounded-xl flex items-center justify-center mb-2`}>
              {card.icon}
            </div>
            <div className="stat-number text-xl text-slate-900">{card.value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Services Table */}
      <div className="section-card animate-slide-up delay-200">
        <div className="section-card-header">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Catalog Services ({services.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">{publishedCount} active · {services.length - publishedCount} draft</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Service Name &amp; Slug</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Availability</th>
                <th>Service Areas</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr key={srv.id}>
                  {/* Publish Toggle */}
                  <td>
                    <button
                      onClick={() => toggleServicePublish(srv.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        srv.isPublished
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                      }`}
                      title="Click to toggle"
                    >
                      {srv.isPublished
                        ? <><Eye className="w-3 h-3" /> Active</>
                        : <><EyeOff className="w-3 h-3" /> Draft</>
                      }
                    </button>
                  </td>

                  {/* Name */}
                  <td>
                    <div className="font-bold text-slate-900 text-xs">{srv.name}</div>
                    <div className="text-slate-400 font-mono text-[10px] mt-0.5">/services/{srv.slug}</div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="badge badge-completed capitalize">{srv.category}</span>
                  </td>

                  {/* Pricing */}
                  <td className="whitespace-nowrap">
                    <div className="font-extrabold text-slate-900 text-xs">
                      12h: ₹{(srv.price12h || srv.basePrice).toLocaleString('en-IN')}
                    </div>
                    <div className="font-extrabold text-emerald-700 text-xs mt-0.5">
                      24h: ₹{(srv.price24h || srv.basePrice).toLocaleString('en-IN')}
                    </div>
                  </td>

                  {/* Availability */}
                  <td>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      {srv.availabilityHours}
                    </div>
                  </td>

                  {/* Areas */}
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {srv.serviceAreas.slice(0, 3).map((area) => (
                        <span key={area} className="badge badge-completed text-[9px]">{area}</span>
                      ))}
                      {srv.serviceAreas.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{srv.serviceAreas.length - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/services/${srv.slug}`}
                        target="_blank"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleEditClick(srv)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {(editingService || isCreatingNew) && (
        <div className="modal-backdrop">
          <div className="modal-panel w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isCreatingNew ? 'Create New Service' : `Edit: ${editingService?.name}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isCreatingNew ? 'Configure a new service for the catalog.' : 'All fields can be edited and saved.'}
                </p>
              </div>
              <button
                onClick={() => { setEditingService(null); setIsCreatingNew(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-4">

                {/* Basic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Service Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="form-input"
                      placeholder="e.g. 24-Hour Home Nursing"
                    />
                  </div>
                  <div>
                    <label className="form-label">URL Slug *</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="form-input font-mono"
                      placeholder="e.g. 24-hour-home-nursing"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">Short Description *</label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    required
                    className="form-input resize-none"
                    placeholder="Brief description shown on service cards and search results..."
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Pricing Model</label>
                    <select
                      value={formData.pricingModel || 'per_shift_12h'}
                      onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                      className="form-input"
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
                    <label className="form-label">12-Hour Shift Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price12h || formData.basePrice || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({ ...formData, price12h: val, basePrice: val });
                      }}
                      className="form-input"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="form-label">24-Hour Shift Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price24h || 0}
                      onChange={(e) => setFormData({ ...formData, price24h: Number(e.target.value) })}
                      className="form-input"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="form-label">Minimum Duration</label>
                    <input
                      type="text"
                      value={formData.minimumDuration || ''}
                      onChange={(e) => setFormData({ ...formData, minimumDuration: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 3 Days"
                    />
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="form-label">What's Included (one per line)</label>
                  <textarea
                    rows={3}
                    value={formData.whatIncluded?.join('\n') || ''}
                    onChange={(e) => setFormData({ ...formData, whatIncluded: e.target.value.split('\n').filter((l) => l.trim()) })}
                    className="form-input resize-none"
                    placeholder="Vital signs documentation&#10;Medication administration&#10;Wound care"
                  />
                </div>

                {/* Exclusions */}
                <div>
                  <label className="form-label">What's NOT Included (one per line)</label>
                  <textarea
                    rows={2}
                    value={formData.whatNotIncluded?.join('\n') || ''}
                    onChange={(e) => setFormData({ ...formData, whatNotIncluded: e.target.value.split('\n').filter((l) => l.trim()) })}
                    className="form-input resize-none"
                    placeholder="Emergency resuscitation&#10;Medicine supply"
                  />
                </div>

                {/* Policies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Additional Charges Disclaimer</label>
                    <input
                      type="text"
                      value={formData.additionalChargesNotice || ''}
                      onChange={(e) => setFormData({ ...formData, additionalChargesNotice: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Cancellation Policy</label>
                    <input
                      type="text"
                      value={formData.cancellationPolicy || ''}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished ?? true}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Publish to Customer Catalog</p>
                    <p className="text-[10px] text-slate-500">When enabled, this service appears live on the website</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingService(null); setIsCreatingNew(false); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn-primary ${saved ? 'opacity-80' : ''}`}
                  disabled={saved}
                >
                  {saved ? (
                    <><span className="animate-pulse">✓</span> Saved!</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Configuration</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
